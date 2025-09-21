// Validation utilities for authentication forms
// Implementing industry-standard validation practices

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Name validation - Only characters, max 20 length
 * @param name - The name to validate
 * @returns ValidationResult
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  // Check if name is empty
  if (!name || name.trim().length === 0) {
    errors.push('Name is required');
    return { isValid: false, errors };
  }
  
  // Remove whitespace for validation
  const trimmedName = name.trim();
  
  // Check length (max 20 characters)
  if (trimmedName.length > 20) {
    errors.push('Name must be 20 characters or less');
  }
  
  // Check if name contains only letters and spaces
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    errors.push('Name can only contain letters and spaces');
  }
  
  // Check for minimum length
  if (trimmedName.length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Email validation with comprehensive checks
 * @param email - The email to validate
 * @returns ValidationResult
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
    return { isValid: false, errors };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Comprehensive email regex following RFC 5322 specification
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('Please enter a valid email address');
  }
  
  // Check email length (max 254 characters as per RFC)
  if (trimmedEmail.length > 254) {
    errors.push('Email address is too long');
  }
  
  // Check for common typos in domain
  const commonDomainTypos = [
    { wrong: 'gmial.com', correct: 'gmail.com' },
    { wrong: 'gmai.com', correct: 'gmail.com' },
    { wrong: 'yahooo.com', correct: 'yahoo.com' },
    { wrong: 'hotmial.com', correct: 'hotmail.com' }
  ];
  
  for (const typo of commonDomainTypos) {
    if (trimmedEmail.includes(typo.wrong)) {
      errors.push(`Did you mean ${trimmedEmail.replace(typo.wrong, typo.correct)}?`);
      break;
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Password validation with industry-standard requirements
 * @param password - The password to validate
 * @returns ValidationResult
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  // Minimum length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Maximum length check (to prevent DoS attacks)
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters');
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }
  
  // Check for common weak passwords
  const commonPasswords = [
    'password', 'password123', '123456789', 'qwerty123', 
    'admin123', 'welcome123', 'letmein123', 'password1'
  ];
  
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common. Please choose a stronger password');
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password should not contain more than 2 repeated characters in a row');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Password confirmation validation
 * @param password - Original password
 * @param confirmPassword - Password confirmation
 * @returns ValidationResult
 */
export const validatePasswordConfirmation = (password: string, confirmPassword: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmPassword) {
    errors.push('Please confirm your password');
    return { isValid: false, errors };
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Real-time validation for better UX
 * @param field - Field type
 * @param value - Field value
 * @returns ValidationResult
 */
export const validateField = (field: 'firstName' | 'lastName' | 'email' | 'password', value: string): ValidationResult => {
  switch (field) {
    case 'firstName':
    case 'lastName':
      return validateName(value);
    case 'email':
      return validateEmail(value);
    case 'password':
      return validatePassword(value);
    default:
      return { isValid: true, errors: [] };
  }
};

/**
 * Get password strength indicator
 * @param password - Password to check
 * @returns Object with strength level and score
 */
export const getPasswordStrength = (password: string): { strength: 'weak' | 'fair' | 'good' | 'strong', score: number } => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password)) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z].*[A-Z]|[A-Z].*[a-z]/.test(password)) score += 1; // Mixed case
  
  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'fair', score };
  if (score <= 6) return { strength: 'good', score };
  return { strength: 'strong', score };
};