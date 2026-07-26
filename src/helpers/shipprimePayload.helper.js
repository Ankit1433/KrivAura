const buildPayload = (order) => {
  return {
    clientReferenceId: `KRIVAURA-${order.id}-${Date.now()}`,

    paymentMethod: order.payment_method === 'COD' ? 'COD' : 'PREPAID',

    collectibleAmount:
      order.payment_method === 'COD' ? Number(order.total_amount) : undefined,

    weightGrams: order.items.reduce(
      (total, item) => total + item.weight_grams * item.quantity,
      0,
    ),

    declaredValue: Number(order.total_amount),

    items: order.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      quantity: item.quantity,
      price: Number(item.price),
      hsnCode: item.hsn_code || '',
      imageUrl: item.image_url || '',
    })),

    pickupAddress: {
      name: process.env.STORE_NAME,
      phone: process.env.STORE_PHONE,
      address1: process.env.STORE_ADDRESS1,
      address2: process.env.STORE_ADDRESS2,
      city: process.env.STORE_CITY,
      state: process.env.STORE_STATE,
      pincode: process.env.STORE_PINCODE,
      country: process.env.STORE_COUNTRY,
    },

    deliveryAddress: {
      name: order.address.full_name,
      phone: order.address.phone,
      address1: order.address.address_line1,
      address2: order.address.address_line2,
      city: order.address.city,
      state: order.address.state,
      pincode: order.address.postal_code,
      country: order.address.country,
    },
  };
};

module.exports = {
  buildPayload,
};
