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

const uploadProductImages = async (productId, files) => {
  const product = await productRepository.getProductById(productId);

  if (!product) {
    throw new AppError(messages.PRODUCT_NOT_FOUND, 404);
  }

  if (!files || files.length === 0) {
    throw new AppError('At least one image is required', 400);
  }

  const hasThumbnail = await productImageRepository.hasThumbnail(productId);

  const uploadedImages = [];

  for (let i = 0; i < files.length; i++) {
    const uploadResult = await uploadToCloudinary(files[i].buffer);

    const image = await productImageRepository.createProductImage(
      productId,
      uploadResult.secure_url,
      !hasThumbnail && i === 0,
    );

    uploadedImages.push(image);
  }

  return uploadedImages;
};

module.exports = {
  uploadProductImages,
};
