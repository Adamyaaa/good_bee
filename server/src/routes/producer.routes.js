import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated strictly to PRODUCER and ADMIN
router.use(requireAuth, requireRole([ROLES.PRODUCER, ROLES.ADMIN]));

// GET /api/v1/producer/submissions - View my submitted formulations
router.get('/submissions', (req, res) => {
  const isSuperAdmin = req.user.role === ROLES.ADMIN;
  const submissions = isSuperAdmin
    ? store.submissions
    : store.submissions.filter((s) => s.producerId === req.user.id);

  res.json({ submissions });
});

// POST /api/v1/producer/submissions - Submit a formulation for Admin Review
router.post('/submissions', (req, res) => {
  const {
    title,
    category,
    concerns = [],
    price,
    mrp,
    volume,
    stock = 30,
    ingredients,
    description,
    image,
    status = PRODUCT_STATUS.PENDING_REVIEW
  } = req.body;

  if (!title || !category || !price) {
    return res.status(400).json({ error: 'Formulation title, category and price are required.' });
  }

  const submission = {
    id: `sub_${Date.now()}`,
    producerId: req.user.id,
    producerName: req.user.companyName || req.user.name,
    title,
    category,
    concerns: Array.isArray(concerns) ? concerns : [concerns],
    price: Number(price),
    mrp: Number(mrp) || Math.round(Number(price) * 1.25),
    volume: volume || '50 ml',
    stock: Number(stock),
    ingredients: ingredients || '',
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    status: [PRODUCT_STATUS.DRAFT, PRODUCT_STATUS.PENDING_REVIEW].includes(status)
      ? status
      : PRODUCT_STATUS.PENDING_REVIEW,
    adminNotes: '',
    submittedAt: new Date().toISOString()
  };

  store.submissions.unshift(submission);

  res.status(201).json({
    message:
      submission.status === PRODUCT_STATUS.PENDING_REVIEW
        ? 'Formulation successfully submitted for Good Bee Quality & Research Admin review.'
        : 'Formulation saved as draft.',
    submission
  });
});

// PUT /api/v1/producer/submissions/:id - Edit draft or rejected submission
router.put('/submissions/:id', (req, res) => {
  const { id } = req.params;
  const submission = store.submissions.find((s) => s.id === id);

  if (!submission) {
    return res.status(404).json({ error: 'Formulation submission not found.' });
  }

  // Ensure producer only edits their own submission (unless Admin)
  if (req.user.role !== ROLES.ADMIN && submission.producerId !== req.user.id) {
    return res.status(403).json({ error: 'Unauthorized to modify this submission.' });
  }

  // If already approved, cannot be casually modified
  if (submission.status === PRODUCT_STATUS.APPROVED) {
    return res.status(400).json({
      error: 'Approved formulations cannot be directly edited. Please file a revision request with Admin.'
    });
  }

  const allowedFields = [
    'title',
    'category',
    'concerns',
    'price',
    'mrp',
    'volume',
    'stock',
    'ingredients',
    'description',
    'image',
    'status'
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      submission[field] = req.body[field];
    }
  });

  // If re-submitting from REJECTED or DRAFT
  if (req.body.resubmit) {
    submission.status = PRODUCT_STATUS.PENDING_REVIEW;
    submission.submittedAt = new Date().toISOString();
  }

  res.json({ message: 'Submission updated successfully.', submission });
});

export default router;
