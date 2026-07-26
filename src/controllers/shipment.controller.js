const shipmentService = require('../services/shipment.service');

const { successResponse } = require('../utils/response');

const createShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.createShipment(req.body);

    return successResponse(res, 'Shipment created successfully', shipment, 201);
  } catch (err) {
    next(err);
  }
};

const getShipments = async (req, res, next) => {
  try {
    const shipments = await shipmentService.getShipments(req.user.id);

    return successResponse(res, 'Shipments fetched successfully', shipments);
  } catch (err) {
    next(err);
  }
};

const getShipmentById = async (req, res, next) => {
  try {
    const shipment = await shipmentService.getShipmentById(
      req.params.id,
      req.user.id,
    );

    return successResponse(res, 'Shipment fetched successfully', shipment);
  } catch (err) {
    next(err);
  }
};

const updateShipmentStatus = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateShipmentStatus(
      req.params.id,
      req.body.shipment_status,
    );

    return successResponse(
      res,
      'Shipment status updated successfully',
      shipment,
    );
  } catch (err) {
    next(err);
  }
};

const updateTracking = async (req, res, next) => {
  try {
    const shipment = await shipmentService.updateTracking(
      req.params.id,
      req.body.tracking_number,
      req.body.awb_code,
      req.body.courier_name,
    );

    return successResponse(res, 'Tracking updated successfully', shipment);
  } catch (err) {
    next(err);
  }
};

const trackShipment = async (req, res, next) => {
  try {
    const tracking = await shipmentService.trackShipment(req.params.id);

    return successResponse(
      res,
      'Shipment tracking fetched successfully',
      tracking,
    );
  } catch (err) {
    next(err);
  }
};

const syncShipment = async (req, res, next) => {
  try {
    const shipment = await shipmentService.syncShipment(req.params.id);

    return successResponse(res, 'Shipment synced successfully', shipment);
  } catch (err) {
    next(err);
  }
};

const cancelShipment = async (req, res, next) => {
  try {
    const response = await shipmentService.cancelShipment(req.params.id);

    return successResponse(res, 'Shipment cancelled successfully', response);
  } catch (err) {
    next(err);
  }
};
module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  updateTracking,
  trackShipment,
  syncShipment,
  cancelShipment,
};
