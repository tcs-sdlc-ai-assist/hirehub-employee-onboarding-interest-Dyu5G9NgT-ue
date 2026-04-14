/**
 * Client-side form validation utilities for HireHub Onboarding Portal.
 * Each validator returns an empty string if valid, or an error message string if invalid.
 */

/**
 * Validates a full name field.
 * @param {string} name - The name to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateName(name) {
  if (name === undefined || name === null) {
    return 'Full name is required.';
  }

  const trimmed = String(name).trim();

  if (trimmed.length === 0) {
    return 'Full name is required.';
  }

  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters.';
  }

  if (trimmed.length > 50) {
    return 'Full name must not exceed 50 characters.';
  }

  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return 'Full name must contain only letters and spaces.';
  }

  return '';
}

/**
 * Validates an email address field.
 * @param {string} email - The email to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateEmail(email) {
  if (email === undefined || email === null) {
    return 'Email is required.';
  }

  const trimmed = String(email).trim();

  if (trimmed.length === 0) {
    return 'Email is required.';
  }

  if (trimmed.length > 100) {
    return 'Email must not exceed 100 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address.';
  }

  return '';
}

/**
 * Validates a mobile/phone number field.
 * Accepts digits, optional leading +, dashes, and spaces. Digit count must be 7-15.
 * @param {string} mobile - The mobile number to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateMobile(mobile) {
  if (mobile === undefined || mobile === null) {
    return 'Mobile number is required.';
  }

  const trimmed = String(mobile).trim();

  if (trimmed.length === 0) {
    return 'Mobile number is required.';
  }

  if (!/^[+\d\s-]+$/.test(trimmed)) {
    return 'Mobile number can only contain digits, spaces, dashes, and an optional leading +.';
  }

  const digitsOnly = trimmed.replace(/[^\d]/g, '');

  if (digitsOnly.length < 7) {
    return 'Mobile number must contain at least 7 digits.';
  }

  if (digitsOnly.length > 15) {
    return 'Mobile number must not exceed 15 digits.';
  }

  return '';
}

const ALLOWED_DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Product',
  'Legal',
  'Support',
];

/**
 * Validates a department selection.
 * @param {string} department - The department to validate.
 * @returns {string} Error message or empty string if valid.
 */
export function validateDepartment(department) {
  if (department === undefined || department === null) {
    return 'Please select a department.';
  }

  const trimmed = String(department).trim();

  if (trimmed.length === 0) {
    return 'Please select a department.';
  }

  if (!ALLOWED_DEPARTMENTS.includes(trimmed)) {
    return 'Please select a valid department.';
  }

  return '';
}

export { ALLOWED_DEPARTMENTS };