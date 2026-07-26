const shipmentRepository = require('../repositories/shipment.repository');
const orderRepository = require('../repositories/order.repository');
const shipprime = require('./shipprime.service');
const { buildPayload } = require('../helpers/shipprimePayload.helper');
const AppError = require('../utils/AppError');
const messages = require('../constants/message');

const createShipment = async (data) => {
  // 1. Check order exists
  const order = await orderRepository.getOrderForShipment(data.order_id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // 2. Shipment already exists?
  const existingShipment = await shipmentRepository.getShipmentByOrderId(
    data.order_id,
  );

  if (existingShipment) {
    throw new AppError('Shipment already exists for this order', 400);
  }

  // 3. Order status validation
  if (!['Confirmed', 'Processing'].includes(order.order_status)) {
    throw new AppError(
      'Shipment can only be created for confirmed or processing orders',
      400,
    );
  }

  // 4. Build ShipPrime Payload
  const payload = buildPayload(order);

  // 5. Call ShipPrime
  const shipprimeResponse = await shipprime.createForwardAwb(payload);
  console.log(shipprimeResponse);

  // 6. Save in DB
  const shipment = await shipmentRepository.createShipment(
    order.id,
    'SHIPPRIME',
    shipprimeResponse.orderId,
    shipprimeResponse.trackingNumber || shipprimeResponse.awb,
    shipprimeResponse.awb,
    shipprimeResponse.courier,
    shipprimeResponse.estimatedDelivery || null,
    shipprimeResponse.labelUrl,
  );

  return shipment;
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
