import { Router } from 'express';
import { store } from '../db/store.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

// Gated strictly to DELIVERY_PARTNER and ADMIN
router.use(requireAuth, requireRole([ROLES.DELIVERY_PARTNER, ROLES.ADMIN]));

// Helper to log delivery status transitions
function recordStatusHistory(assignmentId, prevStatus, newStatus, user, remarks = '') {
  const historyEntry = {
    id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    assignmentId,
    previousStatus: prevStatus,
    newStatus,
    changedByUserId: user.id,
    changedByName: user.name,
    timestamp: new Date().toISOString(),
    remarks: remarks || `Status transitioned from ${prevStatus} to ${newStatus}`
  };
  store.deliveryStatusHistory.unshift(historyEntry);
  return historyEntry;
}

// 1. GET /api/v1/delivery/profile - Authenticated partner profile
router.get('/profile', (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Delivery partner not found.' });
  }

  res.json({
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '+91 99630 75006',
      role: user.role,
      partnerCode: user.partnerCode || 'DEL-2026-001',
      vehicleType: user.vehicleType || 'Electric Scooter (Ather 450X)',
      vehicleNumber: user.vehicleNumber || 'MH-02-EE-4921',
      deliveryZone: user.deliveryZone || 'South Mumbai Central Hub',
      dutyStatus: user.dutyStatus || 'ON_DUTY',
      accountStatus: user.status || 'ACTIVE',
      createdAt: user.createdAt
    }
  });
});

// 2. PUT /api/v1/delivery/profile - Safe profile modifications
router.put('/profile', (req, res) => {
  const user = store.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Delivery partner not found.' });
  }

  const { phone, dutyStatus, vehicleNumber, vehicleType, deliveryZone } = req.body;

  if (phone !== undefined) user.phone = phone.trim();
  if (dutyStatus !== undefined && ['ON_DUTY', 'OFF_DUTY'].includes(dutyStatus)) {
    user.dutyStatus = dutyStatus;
  }
  if (vehicleNumber !== undefined) user.vehicleNumber = vehicleNumber.trim();
  if (vehicleType !== undefined) user.vehicleType = vehicleType.trim();
  if (deliveryZone !== undefined) user.deliveryZone = deliveryZone.trim();

  res.json({
    message: 'Profile updated successfully.',
    profile: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      partnerCode: user.partnerCode || 'DEL-2026-001',
      vehicleType: user.vehicleType,
      vehicleNumber: user.vehicleNumber,
      deliveryZone: user.deliveryZone,
      dutyStatus: user.dutyStatus,
      accountStatus: user.status || 'ACTIVE'
    }
  });
});

// 3. GET /api/v1/delivery/dashboard - Summary telemetry derived from authenticated partner data
router.get('/dashboard', (req, res) => {
  const partnerId = req.user.id;
  const isSuperadmin = req.user.role === ROLES.ADMIN;

  const partnerAssignments = store.deliveryAssignments.filter(
    (a) => isSuperadmin || a.deliveryPartnerId === partnerId
  );

  const totalAssigned = partnerAssignments.length;
  const readyForPickup = partnerAssignments.filter(
    (a) => a.deliveryStatus === 'READY_FOR_PICKUP'
  ).length;
  const inTransit = partnerAssignments.filter(
    (a) => a.deliveryStatus === 'PICKED_UP' || a.deliveryStatus === 'OUT_FOR_DELIVERY'
  ).length;
  const delivered = partnerAssignments.filter(
    (a) => a.deliveryStatus === 'DELIVERED'
  ).length;
  const failed = partnerAssignments.filter(
    (a) => a.deliveryStatus === 'FAILED'
  ).length;

  const recentDeliveries = partnerAssignments
    .filter((a) => a.deliveryStatus !== 'DELIVERED')
    .slice(0, 5);

  const notifications = store.deliveryNotifications.filter(
    (n) => isSuperadmin || n.deliveryPartnerId === partnerId
  );
  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  const recentActivity = store.deliveryStatusHistory.slice(0, 6);

  res.json({
    stats: {
      totalAssigned,
      readyForPickup,
      inTransit,
      delivered,
      failed,
      unreadNotifsCount
    },
    recentDeliveries,
    recentActivity,
    recentNotifications: notifications.slice(0, 3)
  });
});

// 4. GET /api/v1/delivery/deliveries - List assigned deliveries
router.get('/deliveries', (req, res) => {
  const partnerId = req.user.id;
  const isSuperadmin = req.user.role === ROLES.ADMIN;
  const { status, search } = req.query;

  let list = store.deliveryAssignments.filter(
    (a) => isSuperadmin || a.deliveryPartnerId === partnerId
  );

  // Status Filter
  if (status && status !== 'ALL') {
    if (status === 'PREPARING') {
      list = list.filter((a) => a.deliveryStatus === 'WAITING_FOR_PICKUP');
    } else {
      list = list.filter((a) => a.deliveryStatus === status);
    }
  }

  // Order ID or Customer Name Search
  if (search) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.orderId.toLowerCase().includes(q) ||
        a.customerName.toLowerCase().includes(q) ||
        (a.shippingAddress?.pincode && a.shippingAddress.pincode.includes(q))
    );
  }

  res.json({
    count: list.length,
    deliveries: list
  });
});

// 5. GET /api/v1/delivery/deliveries/:id - Delivery Details View
router.get('/deliveries/:id', (req, res) => {
  const { id } = req.params;
  const assignment = store.deliveryAssignments.find(
    (a) => a.id === id || a.orderId === id
  );

  if (!assignment) {
    return res.status(404).json({ error: 'Delivery assignment not found.' });
  }

  // Strict ownership check
  if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden: You can only access deliveries assigned to your account.' });
  }

  // Audit history for this assignment
  const history = store.deliveryStatusHistory.filter((h) => h.assignmentId === assignment.id);

  res.json({
    delivery: assignment,
    history
  });
});

// 6. PUT /api/v1/delivery/deliveries/:id/pickup - Confirm package pickup
router.put('/deliveries/:id/pickup', (req, res) => {
  const { id } = req.params;
  const assignment = store.deliveryAssignments.find(
    (a) => a.id === id || a.orderId === id
  );

  if (!assignment) {
    return res.status(404).json({ error: 'Delivery assignment not found.' });
  }

  if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
  }

  // Validation: Order preparation must be READY_FOR_PICKUP
  if (assignment.orderPreparationStatus !== 'READY_FOR_PICKUP' && assignment.deliveryStatus !== 'READY_FOR_PICKUP') {
    return res.status(400).json({
      error: 'Cannot pickup package yet. Order preparation is still in progress at the laboratory.'
    });
  }

  const prevStatus = assignment.deliveryStatus;
  assignment.deliveryStatus = 'PICKED_UP';
  assignment.pickedUpAt = new Date().toISOString();
  assignment.updatedAt = new Date().toISOString();

  recordStatusHistory(assignment.id, prevStatus, 'PICKED_UP', req.user, 'Package confirmed and picked up from dispensary.');

  res.json({
    message: `Package for Order #${assignment.orderId} picked up successfully.`,
    delivery: assignment
  });
});

// 7. PUT /api/v1/delivery/deliveries/:id/dispatch - Mark out for delivery
router.put('/deliveries/:id/dispatch', (req, res) => {
  const { id } = req.params;
  const assignment = store.deliveryAssignments.find(
    (a) => a.id === id || a.orderId === id
  );

  if (!assignment) {
    return res.status(404).json({ error: 'Delivery assignment not found.' });
  }

  if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
  }

  // Validation: Must be PICKED_UP first
  if (assignment.deliveryStatus !== 'PICKED_UP') {
    return res.status(400).json({
      error: 'Cannot mark out for delivery. Package must be picked up first.'
    });
  }

  const prevStatus = assignment.deliveryStatus;
  assignment.deliveryStatus = 'OUT_FOR_DELIVERY';
  assignment.outForDeliveryAt = new Date().toISOString();
  assignment.updatedAt = new Date().toISOString();

  recordStatusHistory(assignment.id, prevStatus, 'OUT_FOR_DELIVERY', req.user, 'Driver is en route to customer destination.');

  res.json({
    message: `Order #${assignment.orderId} is now Out for Delivery!`,
    delivery: assignment
  });
});

// 8. PUT /api/v1/delivery/deliveries/:id/delivered - Confirm successful delivery
router.put('/deliveries/:id/delivered', (req, res) => {
  const { id } = req.params;
  const { deliveryNotes = 'Handed directly to patron with Good Bee luxury seal.' } = req.body;

  const assignment = store.deliveryAssignments.find(
    (a) => a.id === id || a.orderId === id
  );

  if (!assignment) {
    return res.status(404).json({ error: 'Delivery assignment not found.' });
  }

  if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
  }

  if (assignment.deliveryStatus !== 'OUT_FOR_DELIVERY') {
    return res.status(400).json({
      error: 'Cannot mark as delivered. Package must be Out for Delivery first.'
    });
  }

  const prevStatus = assignment.deliveryStatus;
  assignment.deliveryStatus = 'DELIVERED';
  assignment.deliveredAt = new Date().toISOString();
  assignment.deliveryNotes = deliveryNotes;
  assignment.updatedAt = new Date().toISOString();

  // Also update parent order status
  const order = store.orders.find((o) => o.id === assignment.orderId);
  if (order) {
    order.orderStatus = 'DELIVERED';
    order.deliveredAt = assignment.deliveredAt;
  }

  recordStatusHistory(assignment.id, prevStatus, 'DELIVERED', req.user, deliveryNotes);

  res.json({
    message: `Order #${assignment.orderId} delivered successfully!`,
    delivery: assignment
  });
});

// 9. PUT /api/v1/delivery/deliveries/:id/fail - Report unsuccessful delivery
router.put('/deliveries/:id/fail', (req, res) => {
  const { id } = req.params;
  const { failureReason, failureRemarks } = req.body;

  if (!failureReason) {
    return res.status(400).json({ error: 'Predefined failure reason is required.' });
  }

  const assignment = store.deliveryAssignments.find(
    (a) => a.id === id || a.orderId === id
  );

  if (!assignment) {
    return res.status(404).json({ error: 'Delivery assignment not found.' });
  }

  if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
  }

  const prevStatus = assignment.deliveryStatus;
  assignment.deliveryStatus = 'FAILED';
  assignment.failedAt = new Date().toISOString();
  assignment.failureReason = failureReason;
  assignment.failureRemarks = failureRemarks || 'Delivery attempt unfulfilled.';
  assignment.flaggedForAdminReview = true;
  assignment.updatedAt = new Date().toISOString();

  recordStatusHistory(
    assignment.id,
    prevStatus,
    'FAILED',
    req.user,
    `Delivery Failed: ${failureReason} - ${failureRemarks || ''}`
  );

  res.json({
    message: `Delivery attempt recorded as unsuccessful. Flagged for administrator review.`,
    delivery: assignment
  });
});

// 10. GET /api/v1/delivery/history - Historical deliveries archive
router.get('/history', (req, res) => {
  const partnerId = req.user.id;
  const isSuperadmin = req.user.role === ROLES.ADMIN;
  const { status } = req.query;

  let history = store.deliveryAssignments.filter(
    (a) => (isSuperadmin || a.deliveryPartnerId === partnerId) && (a.deliveryStatus === 'DELIVERED' || a.deliveryStatus === 'FAILED')
  );

  if (status && status !== 'ALL') {
    history = history.filter((a) => a.deliveryStatus === status);
  }

  res.json({
    count: history.length,
    history
  });
});

// 11. GET /api/v1/delivery/notifications - In-app notifications
router.get('/notifications', (req, res) => {
  const partnerId = req.user.id;
  const isSuperadmin = req.user.role === ROLES.ADMIN;

  const notifications = store.deliveryNotifications.filter(
    (n) => isSuperadmin || n.deliveryPartnerId === partnerId
  );

  res.json({
    count: notifications.length,
    unreadCount: notifications.filter((n) => !n.isRead).length,
    notifications
  });
});

// 12. PUT /api/v1/delivery/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const notif = store.deliveryNotifications.find((n) => n.id === id);

  if (!notif) {
    return res.status(404).json({ error: 'Notification not found.' });
  }

  if (notif.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
    return res.status(403).json({ error: 'Forbidden.' });
  }

  notif.isRead = true;
  res.json({ message: 'Marked as read.', notification: notif });
});

// 13. PUT /api/v1/delivery/notifications/mark-all-read - Mark all as read
router.put('/notifications/mark-all-read', (req, res) => {
  const partnerId = req.user.id;
  const isSuperadmin = req.user.role === ROLES.ADMIN;

  store.deliveryNotifications.forEach((n) => {
    if (isSuperadmin || n.deliveryPartnerId === partnerId) {
      n.isRead = true;
    }
  });

  res.json({ message: 'All notifications marked as read.' });
});

export default router;
