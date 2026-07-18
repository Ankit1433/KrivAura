const productRepository = require('../repositories/product.repository');
const AppError = require('../utils/AppError');
const messages = require('../constants/message');

const createProduct = async (product) => {
  const category = await productRepository.findCategoryById(
    product.category_id,
  );

  if (!category) {
    throw new AppError(messages.CATEGORY_NOT_FOUND, 404);
  } 

  const existingSku = await productRepository.findProductBySku(product.sku);

  if (existingSku) {
    throw new AppError(messages.SKU_EXISTS, 409);
  }

  return await productRepository.createProduct(product);
};

const getAllProducts = async () => {
  return await productRepository.getAllProducts();
};

const getProductById = async (productId) => {
  const product = await productRepository.getProductById(productId);
  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }
  return product;
};

const updateProduct = async (productId, product) => {
  const existingProduct = await productRepository.getProductById(productId);

  if (!existingProduct) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  const category = await productRepository.findCategoryById(
    product.category_id,
  );

  if (!category) {
    throw new AppError(messages.CATEGORY_NOT_FOUND, 404);
  }

  return await productRepository.updateProduct(productId, product);
};

const deleteProduct = async (productId) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  return await productRepository.deleteProduct(productId);
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
};
