const pool = require('../config/db');

const createProductImage = async (productId, imageUrl, isThumbnail = false) => {
  const query = `
        INSERT INTO product_images
        (
            product_id,
            image_url,
            is_thumbnail
        )
        VALUES
        (
            $1,$2,$3
        )
        RETURNING
            id,
            product_id,
            image_url,
            is_thumbnail,
            created_at;
    `;

  const result = await pool.query(query, [productId, imageUrl, isThumbnail]);

  return result.rows[0];
};

const hasThumbnail = async (productId) => {
  const query = `
    SELECT id
    FROM product_images
    WHERE product_id = $1
      AND is_thumbnail = TRUE;
  `;

  const result = await pool.query(query, [productId]);

  return result.rows[0];
};

module.exports = {
  createProductImage,
  hasThumbnail,
};
