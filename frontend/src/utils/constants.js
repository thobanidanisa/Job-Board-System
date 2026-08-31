// Shared option lists used by more than one form, defined once so they
// can't drift between e.g. employer registration and the company profile
// edit form.

export const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say']

export const INDUSTRY_OPTIONS = [
  'IT', 'Sales', 'Admin', 'Construction', 'Finance', 'Healthcare',
  'Education', 'Logistics', 'Hospitality', 'Marketing', 'Manufacturing', 'Retail',
]

// Mirrors Backend/api/middleware/validators/jobValidators.js REQUIRED_DOCUMENT_TYPES
export const REQUIRED_DOCUMENT_TYPES = [
  'CV',
  'ID Copy',
  'Qualification Certificate',
  'Cover Letter',
  'Proof of Address',
]
