const addressService = require('../services/address.service');
const { successResponse } = require('../utils/response');

const createAddress = async (req, res, next) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);

    return successResponse(res, 'Address created successfully', address, 201);
  } catch (error) {
    next(error);
  }
};

const getAddresses = async (req, res, next) => {
  try {
    const addresses = await addressService.getAddresses(req.user.id);

    return successResponse(res, 'Addresses fetched successfully', addresses);
  } catch (error) {
    next(error);
  }
};

const getAddressById = async (req, res, next) => {
  try {
    const address = await addressService.getAddressById(
      req.params.id,
      req.user.id,
    );

    return successResponse(res, 'Address fetched successfully', address);
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const address = await addressService.updateAddress(
      req.params.id,
      req.user.id,
      req.body,
    );

    return successResponse(res, 'Address updated successfully', address);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const result = await addressService.deleteAddress(
      req.params.id,
      req.user.id,
    );

    return successResponse(res, result.message);
  } catch (error) {
    next(error);
  }
};

const setDefaultAddress = async (req, res, next) => {
  try {
    const address = await addressService.setDefaultAddress(
      req.params.id,
      req.user.id,
    );

    return successResponse(
      res,
      'Default address updated successfully',
      address,
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
