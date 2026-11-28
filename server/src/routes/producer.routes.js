import { Router } from 'express';
import { listSubmissions, findSubmission, createSubmission, updateSubmission } from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

router.use(requireAuth, requireRole([ROLES.PRODUCER, ROLES.ADMIN]));

// GET /api/v1/producer/submissions
router.get('/submissions', async (req, res, next) => {
  try {
    const isSuperAdmin = req.user.role === ROLES.ADMIN;
    const submissions = await listSubmissions(isSuperAdmin ? null : req.user.id);
    res.json({ count: submissions.length, submissions });
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/producer/submissions
router.post('/submissions', async (req, res, next) => {
  try {
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
      fieldPhotos,
      fieldVideos,
      processingUnitPhotos,
      processingUnitVideos,
      accreditations,
      farmerStory,
      lotNumber,
      origin,
      harvestSeason,
      activePurity,
      coaStatus,
      labCertId,
      status = PRODUCT_STATUS.PENDING_REVIEW
    } = req.body;

    if (!title || !category || !price) {
      return res.status(400).json({ error: 'Formulation title, category and price are required.' });
    }

    const submission = {
      id: `sub_${Date.now()}`,
      producerId: req.user.id,
      producerName: req.user.companyName || req.user.name,
      labCertId: labCertId || req.user.labCertId || '',
      title,
      category,
      concerns: Array.isArray(concerns) ? concerns : [concerns],
      price: Number(price),
      mrp: Number(mrp) || Math.round(Number(price) * 1.25),
      volume: volume || '50 ml',
      stock: Number(stock),
      ingredients: ingredients || '',
      description: description || '',
      image: image || '/images_ref/Clear-skin-300x300.webp',
      fieldPhotos: Array.isArray(fieldPhotos) ? fieldPhotos : (fieldPhotos ? [fieldPhotos] : []),
      fieldVideos: Array.isArray(fieldVideos) ? fieldVideos : (fieldVideos ? [fieldVideos] : []),
      processingUnitPhotos: Array.isArray(processingUnitPhotos) ? processingUnitPhotos : (processingUnitPhotos ? [processingUnitPhotos] : []),
      processingUnitVideos: Array.isArray(processingUnitVideos) ? processingUnitVideos : (processingUnitVideos ? [processingUnitVideos] : []),
      accreditations: Array.isArray(accreditations) ? accreditations : [],
      farmerStory: farmerStory || '',
      lotNumber: lotNumber || '',
      origin: origin || '',
      harvestSeason: harvestSeason || '',
      activePurity: activePurity || '',
      coaStatus: coaStatus || 'IN_ASSAY',
      status: [PRODUCT_STATUS.DRAFT, PRODUCT_STATUS.PENDING_REVIEW].includes(status)
        ? status
        : PRODUCT_STATUS.PENDING_REVIEW,
      adminNotes: '',
      submittedAt: new Date().toISOString()
    };

    const created = await createSubmission(submission);

    res.status(201).json({
      message:
        created.status === PRODUCT_STATUS.PENDING_REVIEW
          ? 'Formulation successfully submitted for Good Bee Quality & Research Admin review.'
          : 'Formulation saved as draft.',
      submission: created
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/producer/submissions/:id
router.put('/submissions/:id', async (req, res, next) => {
  try {
    const submission = await findSubmission(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: 'Formulation submission not found.' });
    }

    if (req.user.role !== ROLES.ADMIN && submission.producerId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to modify this submission.' });
    }

    if (submission.status === PRODUCT_STATUS.APPROVED) {
      return res.status(400).json({
        error: 'Approved formulations cannot be directly edited. Please file a revision request with Admin.'
      });
    }

    const allowedFields = [
      'title', 'category', 'concerns', 'price', 'mrp', 'volume', 'stock',
      'ingredients', 'description', 'image', 'fieldPhotos', 'fieldVideos',
      'processingUnitPhotos', 'processingUnitVideos', 'accreditations',
      'farmerStory', 'status'
    ];
    const patch = {};
    allowedFields.forEach((f) => {
      if (req.body[f] !== undefined) patch[f] = req.body[f];
    });
    if (req.body.resubmit) {
      patch.status = PRODUCT_STATUS.PENDING_REVIEW;
      patch.submittedAt = new Date().toISOString();
    }

    const updated = await updateSubmission(req.params.id, patch);
    res.json({ message: 'Submission updated successfully.', submission: updated });
  } catch (err) {
    next(err);
  }
});

export default router;
