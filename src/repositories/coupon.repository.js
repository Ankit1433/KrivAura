const pool = require('../config/db');
const findCouponByCode = async (code) => {
  const result = await pool.query(
    `select * from coupons where upper(code)=upper($1) and is_active = TRUE`,
    [code],
  );
  return result.rows[0];
};

const incrementCouponUsage = async (couponId, client) => {
  const result = await client.query(
    `UPDATE coupons 
        SET used_count= used_count+1,
        updated_at = current_timestamp
        where id= $1
        and (usage_limit is null or used_count<usage_limit)
        returning *;
    `,
    [couponId],
  );
  return result.rows[0];
};

module.exports = {
  findCouponByCode,
  incrementCouponUsage,
};
