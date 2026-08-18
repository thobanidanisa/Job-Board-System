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

module.exports = { provinceExists };
