const employerModel = require('../models/employerModel');
const lookupModel = require('../models/lookupModel');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const toEmployerResponse = (employer) => ({
  employerId: employer.employer_id,
  companyName: employer.company_name,
  contactPerson: employer.contact_person,
  hrEmail: employer.hr_email,
  email: employer.email,
  phoneNumber: employer.phone_number,
  industryType: employer.industry_type,
  provinceId: employer.province_id,
  town: employer.town,
  streetName: employer.street_name,
  suburb: employer.suburb,
  postalCode: employer.postal_code,
  verificationStatus: employer.verification_status,
  createdAt: employer.created_at,
});

const register = asyncHandler(async (req, res) => {
  const {
    companyName,
    contactPerson,
    hrEmail,
    email,
    password,
    phoneNumber,
    industryType,
    provinceId,
    town,
    streetName,
    suburb,
    postalCode,
  } = req.body;

  const [existingEmail, provinceIsValid] = await Promise.all([
    employerModel.findByEmail(email),
    lookupModel.provinceExists(provinceId),
  ]);

  if (existingEmail) {
    throw new ApiError(409, 'An account with this email already exists');
  }
  if (!provinceIsValid) {
    throw new ApiError(422, 'Invalid province selected');
  }

  const passwordHash = await hashPassword(password);

  const employer = await employerModel.create({
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
  });

  const token = signToken({ sub: employer.employer_id, role: 'employer' });

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: { employer: toEmployerResponse(employer), token },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const employer = await employerModel.findByEmail(email);
  if (!employer) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!employer.is_active) {
    throw new ApiError(403, 'This account has been deactivated');
  }

  const passwordMatches = await comparePassword(password, employer.password_hash);
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken({ sub: employer.employer_id, role: 'employer' });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { employer: toEmployerResponse(employer), token },
  });
});

module.exports = { register, login };
