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

// Profile edit only - deliberately excludes email/password, which are a
// separate concern (re-verification) outside this endpoint's scope.
async function updateProfile(employerId, {
  companyName,
  contactPerson,
  hrEmail,
  phoneNumber,
  industryType,
  provinceId,
  town,
  streetName,
  suburb,
  postalCode,
}) {
  const { rows } = await pool.query(
    `UPDATE employers SET
       company_name = $1, contact_person = $2, hr_email = $3,
       phone_number = $4, industry_type = $5, province_id = $6, town = $7,
       street_name = $8, suburb = $9, postal_code = $10
     WHERE employer_id = $11
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      companyName,
      contactPerson,
      hrEmail,
      phoneNumber,
      industryType,
      provinceId,
      town,
      streetName || null,
      suburb || null,
      postalCode || null,
      employerId,
    ]
  );
  return rows[0] || null;
}

module.exports = { findByEmail, create, updateProfile };
