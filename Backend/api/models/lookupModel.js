const pool = require('../db/pool');

// province_id has no DB-level foreign key by design (see schema notes),
// so existence is checked here at the application layer instead.
async function provinceExists(provinceId) {
  const { rows } = await pool.query(
    'SELECT 1 FROM provinces WHERE province_id = $1',
    [provinceId]
  );
  return rows.length > 0;
}

async function getProvinces() {
  const { rows } = await pool.query(
    'SELECT province_id, province_name FROM provinces ORDER BY province_name'
  );
  return rows;
}

async function categoryExists(categoryId) {
  const { rows } = await pool.query(
    'SELECT 1 FROM categories WHERE category_id = $1 AND is_active = TRUE',
    [categoryId]
  );
  return rows.length > 0;
}

async function getCategories() {
  const { rows } = await pool.query(
    'SELECT category_id, category_name FROM categories WHERE is_active = TRUE ORDER BY category_name'
  );
  return rows;
}

module.exports = { provinceExists, getProvinces, categoryExists, getCategories };
