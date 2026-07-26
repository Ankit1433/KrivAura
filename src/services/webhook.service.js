const shipmentRepository = require('../repositories/shipment.repository');
const { mapShipPrimeStatus } = require('../helpers/shipmentStatusMapper');
const AppError = require('../utils/AppError');

const handleShipPrimeWebhook = async (payload) => {
  const { awb, currentStatus } = payload;

  if (!awb || !currentStatus) {
    throw new AppError('Invalid webhook payload', 400);
  }

  const shipment = await shipmentRepository.getShipmentByAwb(awb);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  const updatedShipment = await shipmentRepository.updateShipmentFromShipPrime(
    shipment.id,
    mapShipPrimeStatus(currentStatus),
    null,
  );

  return updatedShipment;
};

module.exports = {
  handleShipPrimeWebhook,
};
