const addressRepository = require('../repositories/address.repository');
const ApiError = require('../utils/AppError');

const createAddress = async (userId, data) => {
  if (data.is_default) {
    await addressRepository.clearDefault(userId);
  }

  const result = await addressRepository.createAddress(userId, data);

  return result.rows[0];
};

const getAddresses = async (userId) => {
  const result = await addressRepository.getAddresses(userId);

  return result.rows;
};

const getAddressById = async (id, userId) => {
  const result = await addressRepository.getAddressById(id, userId);

  if (result.rows.length === 0) {
    throw new ApiError(404, 'Address not found');
  }

  return result.rows[0];
};

const updateAddress = async (id, userId, data) => {
  const address = await addressRepository.getAddressById(id, userId);

  if (address.rows.length === 0) {
    throw new ApiError(404, 'Address not found');
  }

  if (data.is_default) {
    await addressRepository.clearDefault(userId);
  }

  const result = await addressRepository.updateAddress(id, userId, data);

  return result.rows[0];
};

const deleteAddress = async (id, userId) => {
  const address = await addressRepository.getAddressById(id, userId);

  if (address.rows.length === 0) {
    throw new ApiError(404, 'Address not found');
  }

  await addressRepository.deleteAddress(id, userId);

  return {
    message: 'Address deleted successfully',
  };
};

const setDefaultAddress = async (id, userId) => {
  const address = await addressRepository.getAddressById(id, userId);

  if (address.rows.length === 0) {
    throw new ApiError(404, 'Address not found');
  }

  await addressRepository.clearDefault(userId);

  const result = await addressRepository.setDefault(id, userId);

  return result.rows[0];
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
