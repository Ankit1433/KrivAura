const productService = require('../services/product.service');
const asyncHandler = require('../utils/asyncHandler');

const { successResponse } = require('../utils/response');
const messages = require('../constants/message');

const createProduct = asyncHandler(async (req, res) => {
  const result = await productService.createProduct(req.body);

  return successResponse(res, messages.PRODUCT_CREATED, result, 201);
});

const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts();

  return successResponse(res, messages.PRODUCT_FETCHED, result);
});

const getProductById = asyncHandler(async (req, res) => {
  const result = await productService.getProductById(req.params.id);

  return successResponse(res, messages.PRODUCT_FETCHED, result);
});

const updateProduct = asyncHandler(async (req, res) => {
  const result = await productService.updateProduct(req.params.id, req.body);

  return successResponse(res, messages.PRODUCT_UPDATED, result);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);

  return successResponse(res, messages.PRODUCT_DELETED, result);
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
