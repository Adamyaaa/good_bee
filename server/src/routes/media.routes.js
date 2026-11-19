import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES, PRODUCT_STATUS } from '../config/constants.js';

const router = Router();

// Gated to MEDIA_MANAGER and ADMIN
router.use(requireAuth, requireRole([ROLES.MEDIA_MANAGER, ROLES.ADMIN]));

// Preset luxury image library available in Good Bee
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

// GET /api/v1/media/products - Retrieve all products for media & stock management
router.get('/products', (req, res) => {
  const products = store.products.map((p) => ({
    id: p.id,
    sku: p.sku,
    title: p.title,
    subtitle: p.subtitle,
    category: p.category,
    badge: p.badge,
    volume: p.volume,
    price: p.price,
    mrp: p.mrp,
    stock: p.stock,
    lowStockThreshold: p.lowStockThreshold || store.config.rules.lowStockSafetyThreshold || 10,
    isLowStock: (p.stock || 0) <= (p.lowStockThreshold || store.config.rules.lowStockSafetyThreshold || 10),
    image: p.image,
    gallery: p.gallery || (p.image ? [p.image] : []),
    fieldPhotos: p.fieldPhotos || [],
    fieldVideos: p.fieldVideos || [],
    shortDescription: p.shortDescription || '',
    description: p.description || '',
    ritual: p.ritual || '',
    ingredients: p.ingredients || [],
    concerns: p.concerns || [],
    status: p.status || PRODUCT_STATUS.PUBLISHED
  }));

  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockCount = products.filter((p) => p.isLowStock).length;

  res.json({
    products,
    count: products.length,
    totalStockUnits,
    lowStockCount,
    presetLibrary: PRESET_LIBRARY
  });
});

// PUT /api/v1/media/products/:id/stock - Fast stock & threshold adjustments
router.put('/products/:id/stock', (req, res) => {
  const { id } = req.params;
  const { stock, lowStockThreshold } = req.body;

  const product = store.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (stock !== undefined) {
    product.stock = Math.max(0, parseInt(stock, 10));
  }
  if (lowStockThreshold !== undefined) {
    product.lowStockThreshold = Math.max(0, parseInt(lowStockThreshold, 10));
  }

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
});

// PUT /api/v1/media/products/:id/media - Update photography, primary image & gallery
router.put('/products/:id/media', (req, res) => {
  const { id } = req.params;
  const { image, gallery, fieldPhotos, fieldVideos } = req.body;

  const product = store.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (image !== undefined && image.trim()) {
    product.image = image.trim();
  }
  if (Array.isArray(gallery)) {
    product.gallery = gallery.filter((g) => typeof g === 'string' && g.trim());
    if (product.image && !product.gallery.includes(product.image)) {
      product.gallery.unshift(product.image);
    }
  }
  if (Array.isArray(fieldPhotos)) {
    product.fieldPhotos = fieldPhotos;
  }
  if (Array.isArray(fieldVideos)) {
    product.fieldVideos = fieldVideos;
  }

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
});

// PUT /api/v1/media/products/:id/content - Update copy, descriptions, rituals & badges
router.put('/products/:id/content', (req, res) => {
  const { id } = req.params;
  const {
    title,
    subtitle,
    badge,
    volume,
    category,
    concerns,
    shortDescription,
    description,
    ritual,
    ingredients
  } = req.body;

  const product = store.products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  if (title !== undefined && title.trim()) product.title = title.trim();
  if (subtitle !== undefined) product.subtitle = subtitle.trim();
  if (badge !== undefined) product.badge = badge.trim();
  if (volume !== undefined) product.volume = volume.trim();
  if (category !== undefined) product.category = category.trim();
  if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
  if (description !== undefined) product.description = description.trim();
  if (ritual !== undefined) product.ritual = ritual.trim();

  if (Array.isArray(ingredients)) {
    product.ingredients = ingredients;
  } else if (typeof ingredients === 'string') {
    product.ingredients = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
  }

  if (Array.isArray(concerns)) {
    product.concerns = concerns;
  }

  res.json({
    message: `Editorial content and specifications updated for "${product.title}".`,
    product
  });
});

// GET /api/v1/media/site-content - Storefront banner & promotional text
router.get('/site-content', (req, res) => {
  res.json({ siteContent: store.siteContent || {} });
});

// PUT /api/v1/media/site-content - Update storefront CMS content
router.put('/site-content', (req, res) => {
  store.siteContent = {
    ...(store.siteContent || {}),
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  res.json({
    message: 'Storefront CMS content and banners updated successfully.',
    siteContent: store.siteContent
  });
});

// GET /api/v1/media/presets - Available preset photo assets
router.get('/presets', (req, res) => {
  res.json({ presets: PRESET_LIBRARY });
});

export default router;
