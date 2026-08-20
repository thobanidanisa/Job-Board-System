const lookupModel = require('../models/lookupModel');
const asyncHandler = require('../utils/asyncHandler');

const toProvinceResponse = (province) => ({
  provinceId: province.province_id,
  provinceName: province.province_name,
});

const toCategoryResponse = (category) => ({
  categoryId: category.category_id,
  categoryName: category.category_name,
});

const listProvinces = asyncHandler(async (req, res) => {
  const provinces = await lookupModel.getProvinces();

  res.status(200).json({
    success: true,
    message: 'Provinces retrieved successfully',
    data: { provinces: provinces.map(toProvinceResponse) },
  });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await lookupModel.getCategories();

  res.status(200).json({
    success: true,
    message: 'Categories retrieved successfully',
    data: { categories: categories.map(toCategoryResponse) },
  });
});

module.exports = { listProvinces, listCategories };
