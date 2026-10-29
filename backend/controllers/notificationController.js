import {
  getNotifications as fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '../services/dbAdapter.js';

export async function getNotifications(req, res) {
  try {
    const filters = {
      role: req.user.role,
      ref_id: req.user.ref_id,
      recipient_id: req.user.ref_id
    };

    const notifications = await fetchNotifications(filters, req.dbType);
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
}

export async function markRead(req, res) {
  try {
    const result = await markNotificationRead(req.params.id, req.dbType);
    if (!result) return res.status(404).json({ error: 'Notification not found.' });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
}

export async function markAllRead(req, res) {
  try {
    await markAllNotificationsRead({
      role: req.user.role,
      ref_id: req.user.ref_id,
      recipient_id: req.user.ref_id
    }, req.dbType);
    return res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to mark all notifications as read.' });
  }
}
