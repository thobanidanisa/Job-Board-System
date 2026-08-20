// Shared Vuetify-style validation rules: each rule is a function that
// receives a field value and returns `true` or an error message string.
// These mirror Backend/api/middleware/validators/* field-for-field so the
// client never submits something the API would reject anyway.

export const required = (label = 'This field') => (value) => {
  if (value === null || value === undefined) return `${label} is required`
  if (typeof value === 'string' && value.trim() === '') return `${label} is required`
  return true
}

export const isEmail = (value) => {
  if (!value) return true
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return pattern.test(value) || 'Enter a valid email address'
}

export const isIdNumber = (value) => {
  if (!value) return true
  return /^[0-9]{13}$/.test(value) || 'ID number must be exactly 13 digits'
}

export const isPhoneNumber = (value) => {
  if (!value) return true
  return /^\+?[0-9]{9,15}$/.test(value) || 'Enter a valid phone number (9-15 digits)'
}

export const isPostalCode = (value) => {
  if (!value) return true
  return /^[0-9]{4}$/.test(value) || 'Postal code must be 4 digits'
}

export const isStrongPassword = (value) => {
  if (!value) return true
  if (value.length < 8) return 'Password must be at least 8 characters long'
  if (!/\d/.test(value)) return 'Password must contain at least one number'
  return true
}

export const isAtLeast16 = (value) => {
  if (!value) return true
  const dob = new Date(value)
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 16)
  return dob <= cutoff || 'You must be at least 16 years old to register'
}

export const notInFuture = (value) => {
  if (!value) return true
  return new Date(value) <= new Date() || 'Date of birth cannot be in the future'
}

// Factory: build a "passwords must match" rule bound to a getter for the
// current password value (so it re-evaluates as the user types).
export const matchesPassword = (getPassword) => (value) => {
  return value === getPassword() || 'Passwords do not match'
}

export const isChecked = (label = 'This') => (value) => {
  return value === true || `${label} is required`
}

export const isNonNegativeNumber = (value) => {
  if (value === null || value === undefined || value === '') return true
  return (Number.isFinite(Number(value)) && Number(value) >= 0) || 'Must be a non-negative number'
}

// Factory: build an "end date must be on/after start date" rule bound to
// a getter for the current start-date value.
export const isOnOrAfter = (getStartDate, label = 'End date') => (value) => {
  if (!value || !getStartDate()) return true
  return new Date(value) >= new Date(getStartDate()) || `${label} must be on or after the start date`
}
