import {
  getAdminStats,
  getAllCustomers,
  getAllSellers,
  getAllPayments,
  getAllUsers,
  deactivateUser,
  getAllEmployees,
  getEmployeeById,
  createEmployeeWithUser,
  updateEmployee as modifyEmployee,
  updateEmployeeStatus as modifyEmployeeStatus,
  deleteEmployee as removeEmployee
} from '../services/dbAdapter.js';

export async function getStats(req, res) {
  try {
    const stats = await getAdminStats(req.dbType);
    return res.json(stats);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
}

export async function getEmployees(req, res) {
  try {
    const employees = await getAllEmployees(req.dbType);
    return res.json(employees);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch employees list.' });
  }
}

export async function getEmployee(req, res) {
  try {
    const employee = await getEmployeeById(req.params.id, req.dbType);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    return res.json(employee);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch employee details.' });
  }
}

export async function createEmployee(req, res) {
  try {
    const { name, email, phone, password, address, department, status, employee_id } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: 'Name, email, phone, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    const employee = await createEmployeeWithUser({
      employee_id,
      name,
      email,
      phone,
      password,
      address,
      department,
      status: status || 'Active'
    }, req.dbType);

    return res.status(201).json({
      message: 'Employee registered successfully.',
      employee
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to create employee.' });
  }
}

export async function updateEmployee(req, res) {
  try {
    const employeeId = req.params.id;
    const updates = req.body;

    const updated = await modifyEmployee(employeeId, updates, req.dbType);
    return res.json({
      message: 'Employee updated successfully.',
      employee: updated
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update employee.' });
  }
}

export async function updateEmployeeStatus(req, res) {
  try {
    const employeeId = req.params.id;
    const { status } = req.body;
    if (!status || !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({ error: 'Status must be either "Active" or "Inactive".' });
    }

    const updated = await modifyEmployeeStatus(employeeId, status, req.dbType);
    return res.json({
      message: `Employee account set to ${status}.`,
      employee: updated
    });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update employee status.' });
  }
}

export async function deleteEmployee(req, res) {
  try {
    const employeeId = req.params.id;

    // Safeguard: verify employee exists
    const employee = await getEmployeeById(employeeId, req.dbType);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    // Safeguard: cannot delete admin
    if (employee.user_id === req.user.user_id) {
      return res.status(400).json({ error: 'Cannot delete the logged-in administrator account.' });
    }

    await removeEmployee(employeeId, req.dbType);
    return res.json({ message: 'Employee successfully deleted.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete employee.' });
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

