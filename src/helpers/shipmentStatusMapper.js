const mapShipPrimeStatus = (status) => {
  switch (status?.toUpperCase()) {
    case 'CONFIRMED':
      return 'Pending';

    case 'OUT_FOR_PICKUP':
      return 'Packed';

    case 'PICKED_UP':
    case 'IN_TRANSIT':
      return 'Shipped';

    case 'OUT_FOR_DELIVERY':
      return 'Out For Delivery';

    case 'DELIVERED':
      return 'Delivered';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return 'Pending';
  }
};

module.exports = {
  mapShipPrimeStatus,
};
