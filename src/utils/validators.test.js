import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from './validators';

describe('validateName', () => {
  it('returns error when name is undefined', () => {
    expect(validateName(undefined)).toBe('Full name is required.');
  });

  it('returns error when name is null', () => {
    expect(validateName(null)).toBe('Full name is required.');
  });

  it('returns error when name is empty string', () => {
    expect(validateName('')).toBe('Full name is required.');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Full name is required.');
  });

  it('returns error when name is too short', () => {
    expect(validateName('A')).toBe('Full name must be at least 2 characters.');
  });

  it('returns error when name exceeds 50 characters', () => {
    const longName = 'A'.repeat(51);
    expect(validateName(longName)).toBe('Full name must not exceed 50 characters.');
  });

  it('returns error when name contains numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only letters and spaces.');
  });

  it('returns error when name contains special characters', () => {
    expect(validateName('John@Doe')).toBe('Full name must contain only letters and spaces.');
  });

  it('returns error when name contains hyphens', () => {
    expect(validateName('Mary-Jane')).toBe('Full name must contain only letters and spaces.');
  });

  it('returns empty string for valid name', () => {
    expect(validateName('John Doe')).toBe('');
  });

  it('returns empty string for valid name with multiple spaces', () => {
    expect(validateName('John Michael Doe')).toBe('');
  });

  it('returns empty string for valid two-character name', () => {
    expect(validateName('Jo')).toBe('');
  });

  it('returns empty string for valid name at 50 characters', () => {
    const name = 'A'.repeat(50);
    expect(validateName(name)).toBe('');
  });

  it('returns empty string for name with leading and trailing spaces that trims to valid', () => {
    expect(validateName('  John Doe  ')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns error when email is undefined', () => {
    expect(validateEmail(undefined)).toBe('Email is required.');
  });

  it('returns error when email is null', () => {
    expect(validateEmail(null)).toBe('Email is required.');
  });

  it('returns error when email is empty string', () => {
    expect(validateEmail('')).toBe('Email is required.');
  });

  it('returns error when email is only whitespace', () => {
    expect(validateEmail('   ')).toBe('Email is required.');
  });

  it('returns error when email exceeds 100 characters', () => {
    const longEmail = 'a'.repeat(90) + '@example.com';
    expect(validateEmail(longEmail)).toBe('Email must not exceed 100 characters.');
  });

  it('returns error when email has no @ symbol', () => {
    expect(validateEmail('johndoe.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no domain', () => {
    expect(validateEmail('john@')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address.');
  });

  it('returns error when email has no TLD', () => {
    expect(validateEmail('john@example')).toBe('Please enter a valid email address.');
  });

  it('returns error when email contains spaces', () => {
    expect(validateEmail('john doe@example.com')).toBe('Please enter a valid email address.');
  });

  it('returns empty string for valid email', () => {
    expect(validateEmail('john@example.com')).toBe('');
  });

  it('returns empty string for valid email with subdomain', () => {
    expect(validateEmail('john@mail.example.com')).toBe('');
  });

  it('returns empty string for valid email with plus addressing', () => {
    expect(validateEmail('john+tag@example.com')).toBe('');
  });

  it('returns empty string for valid email with leading/trailing spaces that trims', () => {
    expect(validateEmail('  john@example.com  ')).toBe('');
  });
});

describe('validateMobile', () => {
  it('returns error when mobile is undefined', () => {
    expect(validateMobile(undefined)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is null', () => {
    expect(validateMobile(null)).toBe('Mobile number is required.');
  });

  it('returns error when mobile is empty string', () => {
    expect(validateMobile('')).toBe('Mobile number is required.');
  });

  it('returns error when mobile is only whitespace', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required.');
  });

  it('returns error when mobile contains letters', () => {
    expect(validateMobile('123abc4567')).toBe(
      'Mobile number can only contain digits, spaces, dashes, and an optional leading +.'
    );
  });

  it('returns error when mobile contains special characters other than + - space', () => {
    expect(validateMobile('123(456)7890')).toBe(
      'Mobile number can only contain digits, spaces, dashes, and an optional leading +.'
    );
  });

  it('returns error when mobile has fewer than 7 digits', () => {
    expect(validateMobile('123456')).toBe('Mobile number must contain at least 7 digits.');
  });

  it('returns error when mobile has more than 15 digits', () => {
    expect(validateMobile('1234567890123456')).toBe('Mobile number must not exceed 15 digits.');
  });

  it('returns error when mobile with dashes has fewer than 7 digits', () => {
    expect(validateMobile('12-34-56')).toBe('Mobile number must contain at least 7 digits.');
  });

  it('returns empty string for valid mobile with 7 digits', () => {
    expect(validateMobile('1234567')).toBe('');
  });

  it('returns empty string for valid mobile with 15 digits', () => {
    expect(validateMobile('123456789012345')).toBe('');
  });

  it('returns empty string for valid mobile with leading +', () => {
    expect(validateMobile('+1234567890')).toBe('');
  });

  it('returns empty string for valid mobile with dashes', () => {
    expect(validateMobile('123-456-7890')).toBe('');
  });

  it('returns empty string for valid mobile with spaces', () => {
    expect(validateMobile('123 456 7890')).toBe('');
  });

  it('returns empty string for valid international format', () => {
    expect(validateMobile('+1 555-123-4567')).toBe('');
  });
});

describe('validateDepartment', () => {
  it('returns error when department is undefined', () => {
    expect(validateDepartment(undefined)).toBe('Please select a department.');
  });

  it('returns error when department is null', () => {
    expect(validateDepartment(null)).toBe('Please select a department.');
  });

  it('returns error when department is empty string', () => {
    expect(validateDepartment('')).toBe('Please select a department.');
  });

  it('returns error when department is only whitespace', () => {
    expect(validateDepartment('   ')).toBe('Please select a department.');
  });

  it('returns error when department is not in allowed list', () => {
    expect(validateDepartment('Accounting')).toBe('Please select a valid department.');
  });

  it('returns error for case-mismatched department', () => {
    expect(validateDepartment('engineering')).toBe('Please select a valid department.');
  });

  it('returns empty string for each allowed department', () => {
    ALLOWED_DEPARTMENTS.forEach((dept) => {
      expect(validateDepartment(dept)).toBe('');
    });
  });

  it('returns empty string for Engineering', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for Human Resources', () => {
    expect(validateDepartment('Human Resources')).toBe('');
  });

  it('returns empty string for Marketing', () => {
    expect(validateDepartment('Marketing')).toBe('');
  });
});

describe('ALLOWED_DEPARTMENTS', () => {
  it('exports an array of departments', () => {
    expect(Array.isArray(ALLOWED_DEPARTMENTS)).toBe(true);
  });

  it('contains expected departments', () => {
    expect(ALLOWED_DEPARTMENTS).toContain('Engineering');
    expect(ALLOWED_DEPARTMENTS).toContain('Marketing');
    expect(ALLOWED_DEPARTMENTS).toContain('Sales');
    expect(ALLOWED_DEPARTMENTS).toContain('Human Resources');
    expect(ALLOWED_DEPARTMENTS).toContain('Finance');
    expect(ALLOWED_DEPARTMENTS).toContain('Operations');
    expect(ALLOWED_DEPARTMENTS).toContain('Design');
    expect(ALLOWED_DEPARTMENTS).toContain('Product');
    expect(ALLOWED_DEPARTMENTS).toContain('Legal');
    expect(ALLOWED_DEPARTMENTS).toContain('Support');
  });

  it('has exactly 10 departments', () => {
    expect(ALLOWED_DEPARTMENTS).toHaveLength(10);
  });
});