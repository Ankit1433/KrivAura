const couponRepository = require('../repositories/coupon.repository');
const AppError = require('../utils/AppError');

const calculateCouponDiscount = (coupon, orderAmount) => {
  if (coupon.minimum_order_value > orderAmount) {
    throw new AppError(
      `Minimum order Value for this coupon is ₹${coupon.minimum_order_value}`,
      400,
    );
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw new AppError('Coupon has Expired', 400);
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    throw new AppError('Coupon usage limit reached', 400);
  }

  let discount = 0;
  if (coupon.discount_type === 'PERCENTAGE') {
    discount = orderAmount * Number(coupon.discount_value) * 100;
  }

  if (coupon.maximum_discount !== null) {
    discount = Math.min(discount, Number(coupon.maximum_discount));
  }

  if (coupon.discount_type == 'FIXED') {
    discount = Number(coupon.discount_value);
  }
  discount = Math.min(discount, orderAmount);
  return Number(discount.toFixed(2));
};

const getCouponDiscount = async (code, orderAmount) => {
  const coupon = await couponRepository.findCouponByCode(code);

  if (!coupon) {
    throw new AppError('Invalid coupon code', 400);
  }

  const discount = calculateCouponDiscount(coupon, orderAmount);

  return {
    coupon,
    discount,
    finalAmount: Number((orderAmount - discount).toFixed(2)),
  };
};

module.exports = {
  getCouponDiscount,
};
