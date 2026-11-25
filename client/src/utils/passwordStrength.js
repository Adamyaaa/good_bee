/**
 * Good Bee Botanical Skincare Platform
 * Password Strength & Security Validation Utility
 */

export const PASSWORD_REQUIREMENTS = [
  { id: 'length', label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
  { id: 'lowercase', label: 'One lowercase letter (a-z)', test: (pwd) => /[a-z]/.test(pwd) },
  { id: 'uppercase', label: 'One uppercase letter (A-Z)', test: (pwd) => /[A-Z]/.test(pwd) },
  { id: 'number', label: 'One number (0-9)', test: (pwd) => /[0-9]/.test(pwd) },
  { id: 'special', label: 'One special symbol (!@#$%^&*)', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) }
];

/**
 * Evaluates password strength and returns breakdown & score
 */
export function evaluatePasswordStrength(password = '') {
  const pwd = String(password || '');
  
  if (!pwd) {
    return {
      score: 0,
      scoreOutOf4: 0,
      label: 'Empty',
      percent: 0,
      color: 'gray',
      bgClass: 'bg-gray-200',
      textClass: 'text-gray-400',
      requirements: PASSWORD_REQUIREMENTS.map((r) => ({ ...r, met: false })),
      isValid: false,
      missingFeedback: ['Please enter a password']
    };
  }

  const requirements = PASSWORD_REQUIREMENTS.map((r) => ({
    id: r.id,
    label: r.label,
    met: r.test(pwd)
  }));

  const metCount = requirements.filter((r) => r.met).length;
  const missing = requirements.filter((r) => !r.met).map((r) => r.label);

  let scoreOutOf4 = 1;
  let label = 'Weak';
  let percent = 20;
  let color = 'rose';
  let bgClass = 'bg-rose-500';
  let textClass = 'text-rose-600';

  if (pwd.length < 8 || metCount <= 2) {
    scoreOutOf4 = 1;
    label = 'Weak';
    percent = Math.min(25, Math.max(15, metCount * 10));
    color = 'rose';
    bgClass = 'bg-rose-500';
    textClass = 'text-rose-600';
  } else if (metCount === 3) {
    scoreOutOf4 = 2;
    label = 'Fair';
    percent = 50;
    color = 'amber';
    bgClass = 'bg-amber-500';
    textClass = 'text-amber-600';
  } else if (metCount === 4) {
    scoreOutOf4 = 3;
    label = 'Good';
    percent = 75;
    color = 'sky';
    bgClass = 'bg-sky-500';
    textClass = 'text-sky-600';
  } else if (metCount === 5) {
    scoreOutOf4 = 4;
    label = 'Strong';
    percent = 100;
    color = 'emerald';
    bgClass = 'bg-emerald-500';
    textClass = 'text-emerald-600';
  }

  // To create an account, password must meet length >= 8 and at least 4 criteria (e.g. upper, lower, number, and/or special),
  // ensuring high security while remaining user-friendly.
  const isValid = pwd.length >= 8 && metCount >= 4;

  return {
    score: metCount,
    scoreOutOf4,
    label,
    percent,
    color,
    bgClass,
    textClass,
    requirements,
    isValid,
    missingFeedback: missing
  };
}

/**
 * Validates password for registration with explicit user-friendly error message
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
