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

module.exports = { findByEmail, findByIdNumber, create };
