const jobModel = require('../models/jobModel');
const lookupModel = require('../models/lookupModel');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const toJobResponse = (job) => ({
  jobId: job.job_id,
  employerId: job.employer_id,
  jobTitle: job.job_title,
  department: job.department,
  description: job.description,
  categoryId: job.category_id,
  categoryName: job.category_name ?? null,
  salaryMin: job.salary_min,
  salaryMax: job.salary_max,
  provinceId: job.province_id,
  town: job.town,
  applicationStartDate: job.application_start_date,
  applicationEndDate: job.application_end_date,
  status: job.status,
  skillTags: job.skill_tags,
  requiredDocuments: job.required_documents,
  createdAt: job.created_at,
  updatedAt: job.updated_at,
});

const createJob = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    department,
    description,
    categoryId,
    salaryMin,
    salaryMax,
    provinceId,
    town,
    applicationStartDate,
    applicationEndDate,
    status,
    skillTags,
    requiredDocuments,
  } = req.body;

  const [categoryIsValid, provinceIsValid] = await Promise.all([
    lookupModel.categoryExists(categoryId),
    lookupModel.provinceExists(provinceId),
  ]);

  if (!categoryIsValid) {
    throw new ApiError(422, 'Invalid category selected');
  }
  if (!provinceIsValid) {
    throw new ApiError(422, 'Invalid province selected');
  }

  const job = await jobModel.create({
    employerId: req.auth.id,
    jobTitle,
    department,
    description,
    categoryId,
    salaryMin,
    salaryMax,
    provinceId,
    town,
    applicationStartDate,
    applicationEndDate,
    status: status || 'Open',
    skillTags,
    requiredDocuments,
  });

  res.status(201).json({
    success: true,
    message: 'Job posted successfully',
    data: { job: toJobResponse(job) },
  });
});

const listMyJobs = asyncHandler(async (req, res) => {
  const jobs = await jobModel.findByEmployer(req.auth.id);

  res.status(200).json({
    success: true,
    message: 'Jobs retrieved successfully',
    data: { jobs: jobs.map(toJobResponse) },
  });
});

module.exports = { createJob, listMyJobs };
