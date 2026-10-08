import {
  getAdminStats,
  getAllCustomers,
  getAllSellers,
  getAllPayments,
  getAllUsers,
  deactivateUser
} from '../services/dbAdapter.js';

export async function getStats(req, res) {
  try {
    const stats = await getAdminStats(req.dbType);
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers(req.dbType);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch users list.' });
  }
}

export async function deleteUser(req, res) {
  try {
    const userId = req.params.id;
    if (userId === req.user.user_id) {
      return res.status(400).json({ error: 'Admin cannot delete their own active account.' });
    }

    const success = await deactivateUser(userId, req.dbType);
    if (!success) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ message: 'User successfully deactivated/deleted while preserving order history.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete/deactivate user.' });
  }
}

export async function getCustomers(req, res) {
  try {
    const customers = await getAllCustomers(req.dbType);
    return res.json(customers);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customers list.' });
  }
}

export async function getSellers(req, res) {
  try {
    const sellers = await getAllSellers(req.dbType);
    return res.json(sellers);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch sellers list.' });
  }
}

export async function getPayments(req, res) {
  try {
    const payments = await getAllPayments(req.dbType);
    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch payments audit log.' });
  }
}

