const shipmentRepository = require('../repositories/shipment.repository');
const orderRepository = require('../repositories/order.repository');

const AppError = require('../utils/AppError');
const messages = require('../constants/message');

const createShipment = async (data) => {
  // Check order exists
  const order = await orderRepository.getOrderByIdForShipment(data.order_id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Prevent duplicate shipment
  const shipment = await shipmentRepository.getShipmentByOrderId(data.order_id);

  if (shipment) {
    throw new AppError('Shipment already exists for this order', 400);
  }

  // Order should be confirmed
  if (!['Confirmed', 'Processing'].includes(order.order_status)) {
    throw new AppError(
      'Shipment can only be created for confirmed or processing orders',
      400,
    );
  }

  return await shipmentRepository.createShipment(
    data.order_id,
    data.provider,
    data.shipment_id,
    data.tracking_number,
    data.awb_code,
    data.courier_name,
    data.estimated_delivery,
  );
};

const getShipments = async (userId) => {
  return await shipmentRepository.getShipments(userId);
};

const getShipmentById = async (shipmentId, userId) => {
  const shipment = await shipmentRepository.getShipmentById(shipmentId, userId);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  return shipment;
};

const updateShipmentStatus = async (shipmentId, status) => {
  const shipment = await shipmentRepository.updateShipmentStatus(
    shipmentId,
    status,
  );

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  return shipment;
};

const updateTracking = async (
  shipmentId,
  trackingNumber,
  awbCode,
  courierName,
) => {
  const shipment = await shipmentRepository.updateTracking(
    shipmentId,
    trackingNumber,
    awbCode,
    courierName,
  );

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  return shipment;
};

module.exports = {
  createShipment,
  getShipments,
  getShipmentById,
  updateShipmentStatus,
  updateTracking,
};
