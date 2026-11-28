import { Router } from 'express';
import {
  listProducts,
  findProduct,
  updateProduct,
  getPlatformConfig,
  getSiteContent,
  saveSiteContent
} from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

router.use(requireAuth, requireRole([ROLES.MEDIA_MANAGER, ROLES.ADMIN]));

const PRESET_LIBRARY = [
  { label: 'Frankincense & Myrrh Soap', url: '/images_ref/Frankin-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Donkey Milk & Saffron Soap', url: '/images_ref/Donkey-Milk-Soap-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Clear-Skin Neem & Basil Soap', url: '/images_ref/Clear-skin-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Arabica Coffee Scrub Soap', url: '/images_ref/Coffee-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Wild Turmeric Glow Soap', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.14-1-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Pure Baby Soap (Ultra Mild)', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.01-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Lemongrass Revitalizing Soap', url: '/images_ref/Lemongrass-300x300.webp', category: 'Cold Processed Soaps' },
  { label: 'Pink Lotus Lip Butter', url: '/images_ref/Pink-Lotus-300x300.webp', category: 'Lip & Facial Care' },
  { label: 'Lavender Night Lip Balm', url: '/images_ref/Levendor-300x300.webp', category: 'Lip & Facial Care' },
  { label: 'Moisture Tint Lipstick', url: '/images_ref/Lipstick-600x600.webp', category: 'Lip & Facial Care' },
  { label: 'Rosemary Cold-Pressed Hair Oil', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.56-300x300.webp', category: 'Hair & Scalp Rituals' },
  { label: 'Rosemary Hydrosol Balancing Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.23-300x300.webp', category: 'Botanical Mists' },
  { label: 'Steam-Distilled Rose Hydrosol Mist', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.45.54-300x300.webp', category: 'Botanical Mists' },
  { label: 'Pain Relief Roll-On', url: '/images_ref/WhatsApp-Image-2025-09-19-at-16.46.17-1-300x300.webp', category: 'Therapeutic Body Care' },
  { label: 'Rosemary Essential Extract', url: '/images_ref/Rosmary-2-300x300.webp', category: 'Pure Essential Oils' }
];

// GET /api/v1/media/products
router.get('/products', async (req, res, next) => {
  try {
    const [allProducts, config] = await Promise.all([listProducts(), getPlatformConfig()]);
    const defaultThreshold = config.rules?.lowStockSafetyThreshold || 10;

    const products = allProducts.map((p) => {
      const threshold = p.lowStockThreshold || defaultThreshold;
      return {
        ...p,
        lowStockThreshold: threshold,
        isLowStock: (p.stock || 0) <= threshold,
        gallery: p.gallery || (p.image ? [p.image] : []),
        status: p.status || PRODUCT_STATUS.PUBLISHED
      };
    });

    const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter((p) => p.isLowStock).length;

    res.json({
      products,
      count: products.length,
      totalStockUnits,
      lowStockCount,
      presetLibrary: PRESET_LIBRARY
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/media/products/:id/stock
router.put('/products/:id/stock', async (req, res, next) => {
  try {
    const { stock, lowStockThreshold } = req.body;
    const existing = await findProduct(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const patch = {};
    if (stock !== undefined) patch.stock = Math.max(0, parseInt(stock, 10));
    if (lowStockThreshold !== undefined) patch.lowStockThreshold = Math.max(0, parseInt(lowStockThreshold, 10));

    const product = await updateProduct(existing.id, patch);
    res.json({
      message: `Updated stock for "${product.title}" to ${product.stock} units.`,
      product: {
        id: product.id,
        sku: product.sku,
        title: product.title,
        stock: product.stock,
        lowStockThreshold: product.lowStockThreshold,
        isLowStock: product.stock <= (product.lowStockThreshold || 10)
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/media/products/:id/media
router.put('/products/:id/media', async (req, res, next) => {
  try {
    const { image, gallery, fieldPhotos, fieldVideos } = req.body;
    const existing = await findProduct(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const patch = {};
    if (image !== undefined && image.trim()) patch.image = image.trim();
    if (Array.isArray(gallery)) {
      patch.gallery = gallery.filter((g) => typeof g === 'string' && g.trim());
      const primary = patch.image || existing.image;
      if (primary && !patch.gallery.includes(primary)) {
        patch.gallery.unshift(primary);
      }
    }
    if (Array.isArray(fieldPhotos)) patch.fieldPhotos = fieldPhotos;
    if (Array.isArray(fieldVideos)) patch.fieldVideos = fieldVideos;

    const product = await updateProduct(existing.id, patch);
    res.json({
      message: `Visual media and gallery updated for "${product.title}".`,
      product: {
        id: product.id,
        title: product.title,
        image: product.image,
        gallery: product.gallery,
        fieldPhotos: product.fieldPhotos,
        fieldVideos: product.fieldVideos
      }
    });
  } catch (err) {
    next(err);
  }
});

// PUT /api/v1/media/products/:id/content
router.put('/products/:id/content', async (req, res, next) => {
  try {
    const existing = await findProduct(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const { title, subtitle, badge, volume, category, concerns, shortDescription, description, ritual, ingredients } = req.body;
    const patch = {};
    if (title !== undefined && title.trim()) patch.title = title.trim();
    if (subtitle !== undefined) patch.subtitle = subtitle.trim();
    if (badge !== undefined) patch.badge = badge.trim();
    if (volume !== undefined) patch.volume = volume.trim();
    if (category !== undefined) patch.category = category.trim();
    if (shortDescription !== undefined) patch.shortDescription = shortDescription.trim();
    if (description !== undefined) patch.description = description.trim();
    if (ritual !== undefined) patch.ritual = ritual.trim();
    if (Array.isArray(ingredients)) patch.ingredients = ingredients;
    else if (typeof ingredients === 'string') {
      patch.ingredients = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(concerns)) patch.concerns = concerns;

    const product = await updateProduct(existing.id, patch);
    res.json({
      message: `Editorial content and specifications updated for "${product.title}".`,
      product
    });
  } catch (err) {
    next(err);
  }
});

// GET & PUT /api/v1/media/site-content
router.get('/site-content', async (req, res, next) => {
  try {
    const siteContent = await getSiteContent();
    res.json({ siteContent });
  } catch (err) {
    next(err);
  }
});

router.put('/site-content', async (req, res, next) => {
  try {
    const siteContent = await saveSiteContent(req.body || {});
    res.json({
      message: 'Storefront CMS content and banners updated successfully.',
      siteContent
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/media/presets
router.get('/presets', (req, res) => {
  res.json({ presets: PRESET_LIBRARY });
});

export default router;
