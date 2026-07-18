const pool = require('../config/db.js');

const findcategoryByName = async (name) => {
  const query = 'SELECT id, name FROM categories WHERE LOWER(name) = LOWER($1)';
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

const createCategory = async (category) => {
  const query =
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING id, name, description,is_active, created_at';
  const values = [category.name, category.description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllCategories = async () => {
  const query = `
    SELECT
  id,
  name,
  description
FROM categories
WHERE is_active = TRUE
ORDER BY name ASC;
  `;

  const result = await pool.query(query);

  return result.rows;
};

const getCategoryById = async (id) => {
  const query = `
        SELECT
            id,
            name,
            description
        FROM categories
        WHERE id = $1
        AND is_active = TRUE;
    `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};

const updateCategory = async (id, category) => {
  const query = `
    UPDATE categories
    SET
      name = $1,
      description = $2,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $3
      AND is_active = TRUE
    RETURNING
      id,
      name,
      description,
      is_active,
      created_at,
      updated_at;
  `;

  const values = [category.name, category.description, id];

  const result = await pool.query(query, values);

  return result.rows[0];
};

const deleteCategory = async (id) => {
  const query = `
    UPDATE categories
    SET
      is_active = FALSE,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
      AND is_active = TRUE
    RETURNING
      id,
      name,
      is_active;
  `;

  const result = await pool.query(query, [id]);

  return result.rows[0];
};
module.exports = {
  findcategoryByName,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
