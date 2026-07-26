const axios = require('axios');
const AppError = require('../utils/AppError');

const client = axios.create({
  baseURL: process.env.SHIPPRIME_BASE_URL,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${process.env.SHIPPRIME_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const createForwardAwb = async (payload) => {
  try {
    const response = await client.post('/v1/forward', payload);

    console.log('ShipPrime Response:', response.data);

    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);

    throw new AppError(
      err.response?.data?.message || 'ShipPrime shipment creation failed',
      err.response?.status || 500,
    );
  }
};

const trackShipment = async (awb) => {
  try {
    const response = await client.get('/v1/forward/track', {
      params: { awb },
    });

    return response.data;
  } catch (err) {
    throw new AppError(
      err.response?.data?.message || 'Unable to track shipment',
      err.response?.status || 500,
    );
  }
};

const cancelShipment = async (awb) => {
  try {
    const response = await client.post(`/v1/forward/${awb}/cancel`);

    return response.data;
  } catch (err) {
    throw new AppError(
      err.response?.data?.message || 'Unable to cancel shipment',
      err.response?.status || 500,
    );
  }
};

module.exports = {
  createForwardAwb,
  trackShipment,
  cancelShipment,
};
