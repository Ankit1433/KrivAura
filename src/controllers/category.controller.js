const categoryService = require('../services/category.service');
const {
  createCategorySchema,
} = require('../validations/category.validation.js');
const { successResponse, errorResponse } = require('../utils/response.js');
const messages = require('../constants/message');
const asyncHandler = require('../utils/asyncHandler');

const createCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.createCategory(req.body);
  return successResponse(res, messages.CATEGORY_CREATED, result, 201);
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return successResponse(res, messages.CATEGORIES_FETCHED, categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryById(req.params.id);
  return successResponse(res, messages.CATEGORIES_FETCHED, category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  return successResponse(res, messages.CATEGORY_UPDATED, result);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  return successResponse(res, messages.CATEGORY_DELETED, result);
});
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
