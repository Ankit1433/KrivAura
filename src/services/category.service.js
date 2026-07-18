const categoryRepository = require('../repositories/category.repository.js');
const {
  createCategorySchema,
} = require('../validations/category.validation.js');
const { successResponse } = require('../utils/response.js');
const messages = require('../constants/message.js');
const AppError = require('../utils/AppError');

const createCategory = async (category) => {
  const existingCategory = await categoryRepository.findcategoryByName(
    category.name,
  );
  if (existingCategory) {
    throw new AppError(messages.CATEGORY_EXISTS, 400);
  }
  return await categoryRepository.createCategory(category);
};

const getAllCategories = async () => {
  return await categoryRepository.getAllCategories();
};

const getCategoryById = async (id) => {
  const category = await categoryRepository.getCategoryById(id);
  if (!category) {
    throw new AppError(messages.CATEGORY_NOT_FOUND, 404);
  }
  return category;
};

const updateCategory = async (id, category) => {
  const existingCategory = await categoryRepository.getCategoryById(id);

  if (!existingCategory) {
    throw new AppError(messages.CATEGORY_NOT_FOUND, 404);
  }

  return await categoryRepository.updateCategory(id, category);
};

const deleteCategory = async (id) => {
  const category = await categoryRepository.getCategoryById(id);

  if (!category) {
    throw new AppError(messages.CATEGORY_NOT_FOUND, 404);
  }

  return await categoryRepository.deleteCategory(id);
};
module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
