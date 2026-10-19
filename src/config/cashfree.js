const axios = require('axios');
const AppError = require('../utils/AppError');

const API_VERSION = process.env.CASHFREE_API_VERSION || '2025-01-01';

const getMode = () => {
  const mode = String(process.env.CASHFREE_ENVIRONMENT || 'sandbox').toLowerCase();

  if (!['sandbox', 'production'].includes(mode)) {
    throw new AppError('CASHFREE_ENVIRONMENT must be sandbox or production', 500);
  }

  return mode;
};

const getHeaders = () => {
  if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
    throw new AppError('Cashfree credentials are not configured', 500);
  }

  return {
    'x-client-id': process.env.CASHFREE_CLIENT_ID,
    'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
    'x-api-version': API_VERSION,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};

const request = async (method, path, data) => {
  try {
    const mode = getMode();
    const response = await axios({
      method,
      url: `${mode === 'production' ? 'https://api.cashfree.com/pg' : 'https://sandbox.cashfree.com/pg'}${path}`,
      headers: getHeaders(),
      data,
      timeout: 15000,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const statusCode = error.response ? 502 : 503;
    const message =
      error.response?.data?.message ||
      error.response?.data?.message_text ||
      'Cashfree payment service is unavailable';
    throw new AppError(message, statusCode);
  }
};

const createOrder = (payload) => request('post', '/orders', payload);
const getPayments = (cashfreeOrderId) =>
  request('get', `/orders/${encodeURIComponent(cashfreeOrderId)}/payments`);

module.exports = {
  createOrder,
  getPayments,
  getMode,
};
