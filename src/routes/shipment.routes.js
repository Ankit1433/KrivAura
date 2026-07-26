const express = require('express');

const router = express.Router();

const shipmentController = require('../controllers/shipment.controller');

const authenticate = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/validate.middleware');

const { ADMIN } = require('../constants/roles');

const {
  createShipmentSchema,
  updateShipmentStatusSchema,
  updateTrackingSchema,
} = require('../validations/shipment.validation');

router.get('/', authenticate, shipmentController.getShipments);

router.get('/:id', authenticate, shipmentController.getShipmentById);

router.post(
  '/',
  authenticate,
  authorize(ADMIN),
  validate(createShipmentSchema),
  shipmentController.createShipment,
);
router.get('/:id/track', authenticate, shipmentController.trackShipment);

router.post(
  '/:id/cancel',
  authenticate,
  authorize(ADMIN),
  shipmentController.cancelShipment,
);

router.post(
  '/:id/sync',
  authenticate,
  authorize(ADMIN),
  shipmentController.syncShipment,
);

router.patch(
  '/:id/status',
  authenticate,
  authorize(ADMIN),
  validate(updateShipmentStatusSchema),
  shipmentController.updateShipmentStatus,
);

router.patch(
  '/:id/tracking',
  authenticate,
  authorize(ADMIN),
  validate(updateTrackingSchema),
  shipmentController.updateTracking,
);

module.exports = router;
