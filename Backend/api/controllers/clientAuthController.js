const clientModel = require('../models/clientModel');
const lookupModel = require('../models/lookupModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const toClientResponse = (client) => ({
  clientId: client.client_id,
  name: client.name,
  surname: client.surname,
  email: client.email,
  phoneNumber: client.phone_number,
  provinceId: client.province_id,
  town: client.town,
  streetName: client.street_name,
  suburb: client.suburb,
  postalCode: client.postal_code,
  createdAt: client.created_at,
});

const register = asyncHandler(async (req, res) => {
  const {
    name,
    surname,
    idNumber,
    dateOfBirth,
    gender,
    email,
    password,
    phoneNumber,
    provinceId,
    town,
    streetName,
    suburb,
    postalCode,
  } = req.body;

  const [existingEmail, existingIdNumber, provinceIsValid] = await Promise.all([
    clientModel.findByEmail(email),
    clientModel.findByIdNumber(idNumber),
    lookupModel.provinceExists(provinceId),
  ]);

  if (existingEmail) {
    throw new ApiError(409, 'An account with this email already exists');
  }
  if (existingIdNumber) {
    throw new ApiError(409, 'An account with this ID number already exists');
  }
  if (!provinceIsValid) {
    throw new ApiError(422, 'Invalid province selected');
  }

  const passwordHash = await hashPassword(password);

  const client = await clientModel.create({
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
  });

  const token = signToken({ sub: client.client_id, role: 'client' });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { client: toClientResponse(client), token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const client = await clientModel.findByEmail(email);
  if (!client) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!client.is_active) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const passwordMatches = await comparePassword(password, client.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ sub: client.client_id, role: 'client' });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { client: toClientResponse(client), token },
  });
});

module.exports = { register, login };
