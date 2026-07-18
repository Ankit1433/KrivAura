const productRepository = require('../repositories/product.repository');
const productImageRepository = require('../repositories/productImage.repository');

const AppError = require('../utils/appError');
const messages = require('../constants/message');

const uploadProductImage = async (productId, file) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  if (!file) {
    throw new AppError('Image is required', 400);
  }

  const imageUrl = `/uploads/products/${file.filename}`;

  const thumbnail = await productImageRepository.hasThumbnail(productId);

  const isThumbnail = !thumbnail;

  return await productImageRepository.createProductImage(
    productId,
    imageUrl,
    isThumbnail,
  );
};

module.exports = {
  uploadProductImage,
};
