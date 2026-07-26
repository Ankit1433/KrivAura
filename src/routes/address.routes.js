const express = require('express');

const router = express.Router();

const addressController = require('../controllers/address.controller');

const authenticate = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const {
  createAddressSchema,
  updateAddressSchema,
} = require('../validations/address.validation');

router.get('/', authenticate, addressController.getAddresses);

router.get('/:id', authenticate, addressController.getAddressById);

router.post(
  '/',
  authenticate,
  validate(createAddressSchema),
  addressController.createAddress,
);

router.put(
  '/:id',
  authenticate,
  validate(updateAddressSchema),
  addressController.updateAddress,
);

router.patch('/:id/default', authenticate, addressController.setDefaultAddress);

router.delete('/:id', authenticate, addressController.deleteAddress);

module.exports = router;
