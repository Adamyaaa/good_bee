import { Router } from 'express';
import { store } from '../db/store.js';
import { query, isConnected } from '../db/pg.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user = null;

  // 1. Check live cloud PostgreSQL if connected
  if (isConnected()) {
    try {
      const dbRes = await query('SELECT * FROM users WHERE LOWER(email) = $1', [cleanEmail]);
      if (dbRes.rows.length > 0) {
        const row = dbRes.rows[0];
        // Compare password (plain or hash)
        if (row.password_hash === password) {
          user = {
            id: row.id,
            name: row.name,
            email: row.email,
            role: row.role,
            phone: row.phone,
            companyName: row.company_name,
            tier: row.tier,
            loyaltyPoints: row.loyalty_points || 0,
            referralCode: row.referral_code,
            city: row.city,
            state: row.state
          };
        }
      }
    } catch (err) {
      console.warn('[Auth Login DB Error]', err.message);
    }
  }

  // 2. Fallback to store.users
  if (!user) {
    const matched = store.users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === password
    );
    if (matched) {
      user = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        phone: matched.phone,
        companyName: matched.companyName,
        tier: matched.tier,
        loyaltyPoints: matched.loyaltyPoints || 0,
        referralCode: matched.referralCode,
        city: matched.city,
        state: matched.state
      };
    }
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please verify your email and password.' });
  }

  const token = signToken(user);
  res.json({ token, user });
});

// POST /api/v1/auth/register
// RULE: Every registration defaults to CUSTOMER role. Only ADMIN can promote to PRODUCER (Vendor) or DEALER (Wholesaler).
router.post('/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if email already exists in Postgres or store
  if (isConnected()) {
    try {
      const checkRes = await query('SELECT id FROM users WHERE LOWER(email) = $1', [cleanEmail]);
      if (checkRes.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email address already exists.' });
      }
    } catch (err) {
      console.warn('[Auth Register DB Check Error]', err.message);
    }
  }

  const existingInStore = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existingInStore) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  // 2. STRICT DEFAULT: Always CUSTOMER role
  const assignedRole = ROLES.CUSTOMER;
  const newId = `usr_${Date.now()}`;

  const newUser = {
    id: newId,
    name: name.trim(),
    email: cleanEmail,
    password,
    phone: phone ? phone.trim() : '',
    role: assignedRole,
    companyName: '',
    gstNumber: '',
    loyaltyPoints: 100, // Welcome loyalty bonus for new patrons
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  };

  // 3. Persist to Postgres if connected
  if (isConnected()) {
    try {
      await query(
        `INSERT INTO users (id, name, email, password_hash, role, phone, loyalty_points, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [newUser.id, newUser.name, newUser.email, newUser.password, newUser.role, newUser.phone, newUser.loyaltyPoints, newUser.status]
      );
    } catch (err) {
      console.warn('[Auth Register DB Insert Error]', err.message);
    }
  }

  // Also maintain in store
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
      loyaltyPoints: newUser.loyaltyPoints
    }
  });
});

// GET /api/v1/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

export default router;
