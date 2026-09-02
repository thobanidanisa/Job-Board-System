const clientModel = require('../models/clientModel');
const lookupModel = require('../models/lookupModel');
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

const updateProfile = asyncHandler(async (req, res) => {
  const provinceIsValid = await lookupModel.provinceExists(req.body.provinceId);
  if (!provinceIsValid) {
    throw new ApiError(422, 'Invalid province selected');
  }

  const client = await clientModel.updateProfile(req.auth.id, req.body);

  if (!client) {
    throw new ApiError(404, 'Client account not found');
  }

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: { client: toClientResponse(client) },
  });
});

module.exports = { updateProfile };
