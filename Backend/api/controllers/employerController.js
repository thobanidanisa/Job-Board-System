const employerModel = require('../models/employerModel');
const lookupModel = require('../models/lookupModel');
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

const updateProfile = asyncHandler(async (req, res) => {
  const provinceIsValid = await lookupModel.provinceExists(req.body.provinceId);
  if (!provinceIsValid) {
    throw new ApiError(422, 'Invalid province selected');
  }

  const employer = await employerModel.updateProfile(req.auth.id, req.body);

  if (!employer) {
    throw new ApiError(404, 'Employer account not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { employer: toEmployerResponse(employer) },
  });
});

module.exports = { updateProfile };
