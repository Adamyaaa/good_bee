/**
 * Good Bee API Server
 * Password Complexity & Security Validation
 */

export function validatePasswordForRegistration(password = '') {
  const pwd = String(password || '');
  if (!pwd) {
    return { isValid: false, message: 'Password is required.' };
  }
  if (pwd.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[a-z]/.test(pwd)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter (a-z).' };
  }
  if (!/[A-Z]/.test(pwd)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter (A-Z).' };
  }
  if (!/[0-9]/.test(pwd)) {
    return { isValid: false, message: 'Password must contain at least one number (0-9).' };
  }
  if (!/[^A-Za-z0-9]/.test(pwd)) {
    return { isValid: false, message: 'Password must contain at least one special character (e.g. !@#$%^&*).' };
  }
  return { isValid: true };
}
