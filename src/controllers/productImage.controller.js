const productImageService = require('../services/productImage.service');

const asyncHandler = require('../utils/asyncHandler');

const { successResponse } = require('../utils/response');

const messages = require('../constants/message');

const uploadProductImage = asyncHandler(async (req, res) => {
  const result = await productImageService.uploadProductImages(
    req.params.id,
    req.files,
  );

  return successResponse(res, 'Image uploaded successfully', result, 201);
});

module.exports = {
  uploadProductImage,
};
