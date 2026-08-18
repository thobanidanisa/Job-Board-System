const pool = require('../db/pool');

const PUBLIC_COLUMNS = `
  employer_id, company_name, contact_person, hr_email, email,
  phone_number, industry_type, province_id, town, street_name, suburb,
  postal_code, verification_status, is_active, email_verified,
  created_at, updated_at
`;

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM employers WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function create({
  companyName,
  contactPerson,
  hrEmail,
  email,
  passwordHash,
  phoneNumber,
  industryType,
  provinceId,
  town,
  streetName,
  suburb,
  postalCode,
}) {
  const { rows } = await pool.query(
    `INSERT INTO employers (
       company_name, contact_person, hr_email, email, password_hash,
       phone_number, industry_type, province_id, town, street_name,
       suburb, postal_code
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      companyName,
      contactPerson,
      hrEmail,
      email,
      passwordHash,
      phoneNumber,
      industryType,
      provinceId,
      town,
      streetName || null,
      suburb || null,
      postalCode || null,
    ]
  );
  return rows[0];
}

module.exports = { findByEmail, create };
