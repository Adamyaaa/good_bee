import { Router } from 'express';
import { store } from '../db/store.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = store.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      companyName: user.companyName,
      tier: user.tier,
      loyaltyPoints: user.loyaltyPoints || 0,
      referralCode: user.referralCode
    }
  });
});

// POST /api/v1/auth/register
router.post('/register', (req, res) => {
  const { name, email, password, phone, role = ROLES.CUSTOMER, companyName, gstNumber } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    name,
    email,
    password,
    phone: phone || '',
    role: Object.values(ROLES).includes(role) ? role : ROLES.CUSTOMER,
    companyName: companyName || '',
    gstNumber: gstNumber || '',
    loyaltyPoints: role === ROLES.CUSTOMER ? 100 : 0, // Welcome bonus
    referralCode: role === ROLES.PROMOTER ? name.replace(/\s+/g, '').toUpperCase() + '10' : undefined,
    createdAt: new Date().toISOString()
  };

  store.users.push(newUser);
  const token = signToken(newUser);

  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      loyaltyPoints: newUser.loyaltyPoints,
      referralCode: newUser.referralCode
    }
  });
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      companyName: req.user.companyName,
      tier: req.user.tier,
      loyaltyPoints: req.user.loyaltyPoints || 0,
      referralCode: req.user.referralCode,
      addresses: req.user.addresses || []
    }
  });
});

export default router;
