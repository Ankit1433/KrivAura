const pool = require('../config/db');
const findCategoryById = async (categoryId) => {
  const query = `
        SELECT id
        FROM categories
        WHERE id = $1
        AND is_active = TRUE;
    `;

  const result = await pool.query(query, [categoryId]);

  return result.rows[0];
};

const findProductBySku = async (sku) => {
  const query = `
        SELECT id
        FROM products
        WHERE sku = $1;
    `;

  const result = await pool.query(query, [sku]);

  return result.rows[0];
};

const createProduct = async (product) => {
  const query = `
        INSERT INTO products
        (
            category_id,
            name,
            description,
            price,
            weight_grams,
            discount_price,
            stock,
            sku
        )
        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8
        )
       RETURNING
        id,
        category_id,
        name,
        description,
        price,
        weight_grams,
        discount_price,
        stock,
        sku,
        is_active,
        created_at,
        updated_at;
    `;

  const values = [
    product.category_id,
    product.name,
    product.description,
    product.price,
    product.weight_grams,
    product.discount_price,
    product.stock,
    product.sku,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const getAllProducts = async () => {
  const query = `
          SELECT
        p.id,
        p.name,
        p.description,
        p.price,
        p.weight_grams,
        p.discount_price,
        p.stock,
        p.sku,
        c.id AS category_id,
        c.name AS category_name,
        pi.image_url
    FROM products p
    INNER JOIN categories c
    ON p.category_id = c.id
    LEFT JOIN product_images pi
    ON p.id = pi.product_id
    AND pi.is_thumbnail = TRUE
    WHERE
        p.is_active = TRUE
        AND c.is_active = TRUE
    ORDER BY p.created_at DESC;
    `;

  const result = await pool.query(query);

  return result.rows;
};

const getProductById = async (productId) => {
  const query = `
    SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.weight_grams,
    p.discount_price,
    p.stock,
    p.sku,
    p.is_active,
    p.created_at,

    c.id AS category_id,
    c.name AS category_name,

    COALESCE(
        json_agg(
            json_build_object(
                'id', pi.id,
                'image_url', pi.image_url,
                'is_thumbnail', pi.is_thumbnail
            )
            ORDER BY pi.is_thumbnail DESC, pi.id
        ) FILTER (WHERE pi.id IS NOT NULL),
        '[]'
    ) AS images

FROM products p

INNER JOIN categories c
ON p.category_id = c.id

LEFT JOIN product_images pi
ON p.id = pi.product_id

WHERE
    p.id = $1
    AND p.is_active = TRUE
    AND c.is_active = TRUE

GROUP BY
    p.id,
    c.id;
  `;

  const result = await pool.query(query, [productId]);

  return result.rows[0];
};

const updateProduct = async (productId, product) => {
  const query = `
        UPDATE products 
        SET 
            category_id = $1,
            name = $2,
            description = $3,
            price = $4,
            weight_grams= $5,
            discount_price = $6,
            stock = $7,
            sku = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        AND is_active = TRUE
        RETURNING
          id,
          category_id,
          name,
          description,
          price,
          weight_grams,
          discount_price,
          stock,
          sku,
          is_active,
          created_at,
          updated_at;
    `;

  const values = [
    product.category_id,
    product.name,
    product.description,
    product.price,
    product.weight_grams,
    product.discount_price,
    product.stock,
    product.sku,
    productId,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteProduct = async (productId) => {
  const query = `
    UPDATE products
    SET
      is_active = FALSE,
      updated_at = CURRENT_TIMESTAMP
    WHERE
      id = $1
      AND is_active = TRUE
    RETURNING
      id,
      name,
      is_active,
      updated_at;
  `;

  const result = await pool.query(query, [productId]);

  return result.rows[0];
};

module.exports = {
  findCategoryById,
  findProductBySku,
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
