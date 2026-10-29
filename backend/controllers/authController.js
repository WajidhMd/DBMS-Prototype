import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  createUser,
  createCustomer,
  createSeller,
  createEmployee,
  getCustomerById,
  getSellerById,
  getEmployeeById,
  getDbStatus
} from '../services/dbAdapter.js';

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce_dbms_secret_key_2026';

export async function register(req, res) {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      email,
      phone,
      date_of_birth,
      password,
      confirm_password,
      account_type,
      seller_name
    } = req.body;

    const dbType = req.dbType;

    // 1. Validation
    if (!first_name || !last_name || !email || !phone || !date_of_birth || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Duplicate email check
    const existingUser = await findUserByEmail(email, dbType);
    if (existingUser) {
      return res.status(400).json({ error: `User with email ${email} already exists in ${dbType.toUpperCase()} database.` });
    }

    // Hash password with bcrypt
    const password_hash = await bcrypt.hash(password, 10);
    const userId = `usr-${Date.now()}`;
    const accountTypeUpper = (account_type || 'Customer').toUpperCase();
    let role = 'CUSTOMER';
    if (accountTypeUpper === 'SELLER') role = 'SELLER';
    if (accountTypeUpper === 'EMPLOYEE') role = 'EMPLOYEE';

    let refId = null;

    if (role === 'CUSTOMER') {
      refId = `cust-${Date.now()}`;
      await createUser({
        user_id: userId,
        email,
        password_hash,
        role,
        ref_id: refId,
        is_active: true
      }, dbType);

      await createCustomer({
        customer_id: refId,
        user_id: userId,
        email,
        first_name,
        middle_name: middle_name || '',
        last_name,
        date_of_birth,
        phone
      }, dbType);

    } else if (role === 'SELLER') {
      refId = `sell-${Date.now()}`;
      await createUser({
        user_id: userId,
        email,
        password_hash,
        role,
        ref_id: refId,
        is_active: true
      }, dbType);

      await createSeller({
        seller_id: refId,
        user_id: userId,
        name: seller_name || `${first_name} ${last_name} Store`,
        email,
        phone
      }, dbType);

    } else if (role === 'EMPLOYEE') {
      refId = `emp-${Date.now()}`;
      await createUser({
        user_id: userId,
        email,
        password_hash,
        role,
        ref_id: refId,
        is_active: true
      }, dbType);

      await createEmployee({
        employee_id: refId,
        user_id: userId,
        name: `${first_name} ${last_name}`,
        email,
        phone
      }, dbType);
    }

    return res.status(201).json({
      message: 'Registration successful! You can now log in.',
      user_id: userId,
      role,
      target_db: dbType
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error during registration.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const dbType = req.dbType;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email, dbType);
    if (!user) {
      return res.status(401).json({ error: `Invalid email or password for ${dbType.toUpperCase()} target database.` });
    }

    // Account status check
    if (user.is_active === false || user.status === 'DELETED') {
      return res.status(403).json({ error: 'Account has been deactivated/deleted by Admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Fetch entity profile
    let profile = null;
    if (user.role === 'CUSTOMER' && user.ref_id) {
      profile = await getCustomerById(user.ref_id, dbType);
    } else if (user.role === 'SELLER' && user.ref_id) {
      profile = await getSellerById(user.ref_id, dbType);
    } else if (user.role === 'EMPLOYEE' && user.ref_id) {
      profile = await getEmployeeById(user.ref_id, dbType);
    }

    // Generate JWT Token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        ref_id: user.ref_id,
        dbType
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        ref_id: user.ref_id,
        profile
      },
      target_db: dbType
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
}

export async function getMe(req, res) {
  try {
    const dbType = req.dbType;
    const user = await findUserByEmail(req.user.email, dbType);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.is_active === false || user.status === 'DELETED') {
      return res.status(403).json({ error: 'Account has been deactivated/deleted by Admin.' });
    }

    let profile = null;
    if (user.role === 'CUSTOMER' && user.ref_id) {
      profile = await getCustomerById(user.ref_id, dbType);
    } else if (user.role === 'SELLER' && user.ref_id) {
      profile = await getSellerById(user.ref_id, dbType);
    } else if (user.role === 'EMPLOYEE' && user.ref_id) {
      profile = await getEmployeeById(user.ref_id, dbType);
    }

    const dbStatus = await getDbStatus(dbType);

    return res.json({
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      ref_id: user.ref_id,
      profile,
      dbStatus
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user details.' });
  }
}

export function getSampleAccounts(req, res) {
  return res.json({
    message: 'Sample demo credentials available across all databases (PostgreSQL, MongoDB)',
    password: 'password123',
    accounts: [
      {
        role: 'ADMIN',
        email: 'admin@ecommerce.com',
        password: 'password123',
        description: 'System Administrator - Full Access to Dashboards & Reports'
      },
      {
        role: 'EMPLOYEE',
        email: 'employee@ecommerce.com',
        password: 'password123',
        description: 'Sample Employee - Intermediary processing customer & seller order workflows'
      },
      {
        role: 'CUSTOMER',
        email: 'john.doe@example.com',
        password: 'password123',
        description: 'John Doe - Registered Customer with sample addresses and orders'
      },
      {
        role: 'CUSTOMER',
        email: 'jane.smith@example.com',
        password: 'password123',
        description: 'Jane Smith - Registered Customer'
      },
      {
        role: 'SELLER',
        email: 'techworld@seller.com',
        password: 'password123',
        description: 'TechWorld Electronics - Seller with listed products'
      },
      {
        role: 'SELLER',
        email: 'fashionhub@seller.com',
        password: 'password123',
        description: 'FashionHub Apparel - Seller with apparel products'
      }
    ]
  });
}
