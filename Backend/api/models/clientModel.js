const pool = require('../db/pool');

const PUBLIC_COLUMNS = `
  client_id, name, surname, id_number, date_of_birth, gender, email,
  phone_number, province_id, town, street_name, suburb, postal_code,
  is_active, email_verified, created_at, updated_at
`;

async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT * FROM clients WHERE email = $1',
    [email]
  );
  return rows[0] || null;
}

async function findByIdNumber(idNumber) {
  const { rows } = await pool.query(
    'SELECT client_id FROM clients WHERE id_number = $1',
    [idNumber]
  );
  return rows[0] || null;
}

async function create({
  name,
  surname,
  idNumber,
  dateOfBirth,
  gender,
  email,
  passwordHash,
  phoneNumber,
  provinceId,
  town,
  streetName,
  suburb,
  postalCode,
}) {
  const { rows } = await pool.query(
    `INSERT INTO clients (
       name, surname, id_number, date_of_birth, gender, email, password_hash,
       phone_number, province_id, town, street_name, suburb, postal_code
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
     RETURNING ${PUBLIC_COLUMNS}`,
    [
      name,
      surname,
      idNumber,
      dateOfBirth,
      gender,
      email,
      passwordHash,
      phoneNumber,
      provinceId,
      town,
      streetName,
      suburb,
      postalCode,
    ]
  );
  return rows[0];
}

// Profile edit only. Deliberately excludes email/password (separate
// concern) and id_number/date_of_birth, which are identity fields set at
// registration rather than things a profile form should rewrite.
async function updateProfile(clientId, {
  name,
  surname,
  phoneNumber,
  provinceId,
  town,
  streetName,
  suburb,
  postalCode,
}) {
  const { rows } = await pool.query(
    `UPDATE clients SET
       name = $1, surname = $2, phone_number = $3, province_id = $4,
       town = $5, street_name = $6, suburb = $7, postal_code = $8
     WHERE client_id = $9
     RETURNING ${PUBLIC_COLUMNS}`,
    [name, surname, phoneNumber, provinceId, town, streetName, suburb, postalCode, clientId]
  );
  return rows[0] || null;
}

module.exports = { findByEmail, findByIdNumber, create, updateProfile };
