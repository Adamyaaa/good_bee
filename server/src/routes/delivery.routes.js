import { Router } from 'express';
import {
  findUserById,
  updateUserById,
  listDeliveryAssignments,
  findDeliveryAssignment,
  updateDeliveryAssignment,
  listDeliveryHistoryEntries,
  listDeliveryNotifications,
  markDeliveryNotificationRead,
  markAllDeliveryNotificationsRead,
  updateOrder
} from '../db/repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ROLES } from '../config/constants.js';

const router = Router();

router.use(requireAuth, requireRole([ROLES.DELIVERY_PARTNER, ROLES.ADMIN]));

function buildHistoryEntry(assignmentId, prevStatus, newStatus, user, remarks = '') {
  return {
    id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    assignmentId,
    previousStatus: prevStatus,
    newStatus,
    changedByUserId: user.id,
    changedByName: user.name,
    timestamp: new Date().toISOString(),
    remarks: remarks || `Status transitioned from ${prevStatus} to ${newStatus}`
  };
}

// 1. GET /api/v1/delivery/profile
router.get('/profile', async (req, res, next) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Delivery partner not found.' });
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
  } catch (err) {
    next(err);
  }
});

// 2. PUT /api/v1/delivery/profile
router.put('/profile', async (req, res, next) => {
  try {
    const { phone, dutyStatus, vehicleNumber, vehicleType, deliveryZone } = req.body;
    const patch = {};
    if (phone !== undefined) patch.phone = phone.trim();
    if (dutyStatus !== undefined && ['ON_DUTY', 'OFF_DUTY'].includes(dutyStatus)) patch.dutyStatus = dutyStatus;
    if (vehicleNumber !== undefined) patch.vehicleNumber = vehicleNumber.trim();
    if (vehicleType !== undefined) patch.vehicleType = vehicleType.trim();
    if (deliveryZone !== undefined) patch.deliveryZone = deliveryZone.trim();

    const updated = await updateUserById(req.user.id, patch);
    if (!updated) return res.status(404).json({ error: 'Delivery partner not found.' });

    res.json({
      message: 'Profile updated successfully.',
      profile: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: updated.role,
        partnerCode: updated.partnerCode || 'DEL-2026-001',
        vehicleType: updated.vehicleType,
        vehicleNumber: updated.vehicleNumber,
        deliveryZone: updated.deliveryZone,
        dutyStatus: updated.dutyStatus,
        accountStatus: updated.status || 'ACTIVE'
      }
    });
  } catch (err) {
    next(err);
  }
});

// 3. GET /api/v1/delivery/dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const [partnerAssignments, notifications, recentActivity] = await Promise.all([
      listDeliveryAssignments({ partnerId: req.user.id, isAdmin }),
      listDeliveryNotifications({ partnerId: req.user.id, isAdmin }),
      listDeliveryHistoryEntries(null, 6)
    ]);

    res.json({
      stats: {
        totalAssigned: partnerAssignments.length,
        readyForPickup: partnerAssignments.filter((a) => a.deliveryStatus === 'READY_FOR_PICKUP').length,
        inTransit: partnerAssignments.filter(
          (a) => a.deliveryStatus === 'PICKED_UP' || a.deliveryStatus === 'OUT_FOR_DELIVERY'
        ).length,
        delivered: partnerAssignments.filter((a) => a.deliveryStatus === 'DELIVERED').length,
        failed: partnerAssignments.filter((a) => a.deliveryStatus === 'FAILED').length,
        unreadNotifsCount: notifications.filter((n) => !n.isRead).length
      },
      recentDeliveries: partnerAssignments.filter((a) => a.deliveryStatus !== 'DELIVERED').slice(0, 5),
      recentActivity,
      recentNotifications: notifications.slice(0, 3)
    });
  } catch (err) {
    next(err);
  }
});

// 4. GET /api/v1/delivery/deliveries
router.get('/deliveries', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const { status, search } = req.query;
    const list = await listDeliveryAssignments({ partnerId: req.user.id, isAdmin, status, search });
    res.json({ count: list.length, deliveries: list });
  } catch (err) {
    next(err);
  }
});

// 5. GET /api/v1/delivery/deliveries/:id
router.get('/deliveries/:id', async (req, res, next) => {
  try {
    const assignment = await findDeliveryAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Delivery assignment not found.' });
    if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You can only access deliveries assigned to your account.' });
    }
    const history = await listDeliveryHistoryEntries(assignment.id);
    res.json({ delivery: assignment, history });
  } catch (err) {
    next(err);
  }
});

// 6. PUT /api/v1/delivery/deliveries/:id/pickup
router.put('/deliveries/:id/pickup', async (req, res, next) => {
  try {
    const assignment = await findDeliveryAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Delivery assignment not found.' });
    if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
    }
    if (assignment.orderPreparationStatus !== 'READY_FOR_PICKUP' && assignment.deliveryStatus !== 'READY_FOR_PICKUP') {
      return res.status(400).json({
        error: 'Cannot pickup package yet. Order preparation is still in progress at the laboratory.'
      });
    }

    const hist = buildHistoryEntry(
      assignment.id,
      assignment.deliveryStatus,
      'PICKED_UP',
      req.user,
      'Package confirmed and picked up from dispensary.'
    );
    const updated = await updateDeliveryAssignment(
      assignment.id,
      { deliveryStatus: 'PICKED_UP', pickedUpAt: new Date().toISOString() },
      hist
    );
    res.json({ message: `Package for Order #${assignment.orderId} picked up successfully.`, delivery: updated });
  } catch (err) {
    next(err);
  }
});

// 7. PUT /api/v1/delivery/deliveries/:id/dispatch
router.put('/deliveries/:id/dispatch', async (req, res, next) => {
  try {
    const assignment = await findDeliveryAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Delivery assignment not found.' });
    if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
    }
    if (assignment.deliveryStatus !== 'PICKED_UP') {
      return res.status(400).json({ error: 'Cannot mark out for delivery. Package must be picked up first.' });
    }

    const hist = buildHistoryEntry(
      assignment.id,
      assignment.deliveryStatus,
      'OUT_FOR_DELIVERY',
      req.user,
      'Driver is en route to customer destination.'
    );
    const updated = await updateDeliveryAssignment(
      assignment.id,
      { deliveryStatus: 'OUT_FOR_DELIVERY', outForDeliveryAt: new Date().toISOString() },
      hist
    );
    await updateOrder(assignment.orderId, { status: 'DISPATCHED' }).catch(() => null);

    res.json({ message: `Order #${assignment.orderId} is now Out for Delivery!`, delivery: updated });
  } catch (err) {
    next(err);
  }
});

// 8. PUT /api/v1/delivery/deliveries/:id/delivered
router.put('/deliveries/:id/delivered', async (req, res, next) => {
  try {
    const { deliveryNotes = 'Handed directly to patron with Good Bee luxury seal.' } = req.body || {};
    const assignment = await findDeliveryAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Delivery assignment not found.' });
    if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
    }
    if (assignment.deliveryStatus !== 'OUT_FOR_DELIVERY') {
      return res.status(400).json({ error: 'Cannot mark as delivered. Package must be Out for Delivery first.' });
    }

    const deliveredAt = new Date().toISOString();
    const hist = buildHistoryEntry(assignment.id, assignment.deliveryStatus, 'DELIVERED', req.user, deliveryNotes);
    const updated = await updateDeliveryAssignment(
      assignment.id,
      { deliveryStatus: 'DELIVERED', deliveredAt, deliveryNotes },
      hist
    );
    await updateOrder(assignment.orderId, { status: 'DELIVERED', deliveredAt }).catch(() => null);

    res.json({ message: `Order #${assignment.orderId} delivered successfully!`, delivery: updated });
  } catch (err) {
    next(err);
  }
});

// 9. PUT /api/v1/delivery/deliveries/:id/fail
router.put('/deliveries/:id/fail', async (req, res, next) => {
  try {
    const { failureReason, failureRemarks } = req.body || {};
    if (!failureReason) {
      return res.status(400).json({ error: 'Predefined failure reason is required.' });
    }
    const assignment = await findDeliveryAssignment(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Delivery assignment not found.' });
    if (assignment.deliveryPartnerId !== req.user.id && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ error: 'Forbidden: You can only update deliveries assigned to your account.' });
    }

    const hist = buildHistoryEntry(
      assignment.id,
      assignment.deliveryStatus,
      'FAILED',
      req.user,
      `Delivery Failed: ${failureReason} - ${failureRemarks || ''}`
    );
    const updated = await updateDeliveryAssignment(
      assignment.id,
      {
        deliveryStatus: 'FAILED',
        failedAt: new Date().toISOString(),
        failureReason,
        failureRemarks: failureRemarks || 'Delivery attempt unfulfilled.',
        flaggedForAdminReview: true
      },
      hist
    );

    res.json({
      message: 'Delivery attempt recorded as unsuccessful. Flagged for administrator review.',
      delivery: updated
    });
  } catch (err) {
    next(err);
  }
});

// 10. GET /api/v1/delivery/history
router.get('/history', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const all = await listDeliveryAssignments({ partnerId: req.user.id, isAdmin });
    let history = all.filter((a) => a.deliveryStatus === 'DELIVERED' || a.deliveryStatus === 'FAILED');
    if (req.query.status && req.query.status !== 'ALL') {
      history = history.filter((a) => a.deliveryStatus === req.query.status);
    }
    res.json({ count: history.length, history });
  } catch (err) {
    next(err);
  }
});

// 11. GET /api/v1/delivery/notifications
router.get('/notifications', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const notifications = await listDeliveryNotifications({ partnerId: req.user.id, isAdmin });
    res.json({
      count: notifications.length,
      unreadCount: notifications.filter((n) => !n.isRead).length,
      notifications
    });
  } catch (err) {
    next(err);
  }
});

// 12. PUT /api/v1/delivery/notifications/:id/read
router.put('/notifications/:id/read', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    const result = await markDeliveryNotificationRead(req.params.id, { partnerId: req.user.id, isAdmin });
    if (result.status === 404) return res.status(404).json({ error: 'Notification not found.' });
    if (result.status === 403) return res.status(403).json({ error: 'Forbidden.' });
    res.json({ message: 'Marked as read.', notification: result.notification });
  } catch (err) {
    next(err);
  }
});

// 13. PUT /api/v1/delivery/notifications/mark-all-read
router.put('/notifications/mark-all-read', async (req, res, next) => {
  try {
    const isAdmin = req.user.role === ROLES.ADMIN;
    await markAllDeliveryNotificationsRead({ partnerId: req.user.id, isAdmin });
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    next(err);
  }
});

export default router;
