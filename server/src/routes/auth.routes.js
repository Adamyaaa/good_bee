import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser, sanitizeUser } from '../db/repo.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';
import { validatePasswordForRegistration } from '../utils/passwordValidator.js';

const router = Router();

async function verifyPassword(user, rawPass, cleanPass) {
  const storedHash = user.passwordHash || user.password || '';
  if (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$')) {
    if (await bcrypt.compare(rawPass, storedHash)) return true;
    if (cleanPass !== rawPass && (await bcrypt.compare(cleanPass, storedHash))) return true;
  } else if (storedHash && (storedHash === rawPass || storedHash === cleanPass)) {
    return true;
  }

  if (user.passwordSecondary && (user.passwordSecondary === rawPass || user.passwordSecondary === cleanPass)) {
    return true;
  }
  return false;
}

// POST /api/v1/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const rawPass = String(password);

    const matched = await findUserByEmail(cleanEmail);
    if (!matched || !(await verifyPassword(matched, rawPass, cleanPass))) {
      return res.status(401).json({ error: 'Incorrect credentials' });
    }

    const safeUser = sanitizeUser(matched);
    const token = signToken(safeUser);
    res.json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, phone, companyName, gstNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const passwordCheck = validatePasswordForRegistration(password);
    if (!passwordCheck.isValid) {
      return res.status(400).json({ error: passwordCheck.message });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = {
      id: `usr_${Date.now()}`,
      name: String(name).trim(),
      email: cleanEmail,
      passwordHash,
      password: passwordHash,
      phone: phone ? String(phone).trim() : '',
      role: ROLES.CUSTOMER,
      companyName: companyName ? String(companyName).trim() : '',
      gstNumber: gstNumber ? String(gstNumber).trim() : '',
      loyaltyPoints: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const created = await createUser(newUser);
    const safeUser = sanitizeUser(created);
    const token = signToken(safeUser);

    res.status(201).json({ token, user: safeUser });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
