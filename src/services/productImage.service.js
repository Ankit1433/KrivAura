const { Readable } = require('stream');

const cloudinary = require('../config/cloudinary');

const productRepository = require('../repositories/product.repository');
const productImageRepository = require('../repositories/productImage.repository');

const AppError = require('../utils/AppError');
const messages = require('../constants/message');

const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'krivaura/products',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

const uploadProductImage = async (productId, file) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  if (!file) {
    throw new AppError('Image is required', 400);
  }

  const uploadResult = await uploadToCloudinary(file.buffer);

  const imageUrl = uploadResult.secure_url;

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
