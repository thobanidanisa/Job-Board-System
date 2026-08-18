const lookupModel = require('../models/lookupModel');
const asyncHandler = require('../utils/asyncHandler');

const toProvinceResponse = (province) => ({
  provinceId: province.province_id,
  provinceName: province.province_name,
});

const listProvinces = asyncHandler(async (req, res) => {
  const provinces = await lookupModel.getProvinces();

  res.status(200).json({
    success: true,
    message: 'Provinces retrieved successfully',
    data: { provinces: provinces.map(toProvinceResponse) },
  });
});

module.exports = { listProvinces };
