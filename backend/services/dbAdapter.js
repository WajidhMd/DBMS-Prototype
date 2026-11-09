import bcrypt from 'bcryptjs';
import { getPostgresPool, testPostgresConnection } from '../database/postgresql.js';
import { getMongoDB, testMongoDBConnection } from '../database/mongodb.js';
import {
  sampleUsers,
  sampleCustomers,
  sampleAddresses,
  sampleSellers,
  sampleEmployees,
  sampleCategories,
  sampleProducts,
  sampleCarts,
  sampleCartItems,
  sampleOrders,
  sampleOrderItems,
  samplePayments,
  sampleReviews,
  sampleOrderHistory,
  sampleWishlists
} from '../../database/seedData.js';

// In-Memory Storage Instances for seamless demo mode per database target
const memoryStores = {
  postgresql: createSeedSnapshot(),
  mongodb: createSeedSnapshot()
};

function createSeedSnapshot() {
  return {
    users: JSON.parse(JSON.stringify(sampleUsers)),
    customers: JSON.parse(JSON.stringify(sampleCustomers)),
    addresses: JSON.parse(JSON.stringify(sampleAddresses)),
    sellers: JSON.parse(JSON.stringify(sampleSellers)),
    employees: JSON.parse(JSON.stringify(sampleEmployees || [])),
    categories: JSON.parse(JSON.stringify(sampleCategories)),
    products: JSON.parse(JSON.stringify(sampleProducts)),
    carts: JSON.parse(JSON.stringify(sampleCarts)),
    cart_item: JSON.parse(JSON.stringify(sampleCartItems)),
    orders: JSON.parse(JSON.stringify(sampleOrders)),
    order_item: JSON.parse(JSON.stringify(sampleOrderItems)),
    payments: JSON.parse(JSON.stringify(samplePayments)),
    reviews: JSON.parse(JSON.stringify(sampleReviews)),
    order_history: JSON.parse(JSON.stringify(sampleOrderHistory || [])),
    return_requests: [],
    return_items: [],
    return_status_history: [],
    notifications: [],
    feedback_moderation: [],
    wishlists: JSON.parse(JSON.stringify(sampleWishlists || []))
  };
}

function getStore(dbType) {
  const normType = normalizeDbType(dbType);
  return memoryStores[normType] || memoryStores.postgresql;
}

function normalizeDbType(dbType) {
  const norm = (dbType || 'postgresql').toLowerCase();
  if (norm === 'postgres') return 'postgresql';
  if (norm === 'mongo') return 'mongodb';
  if (norm === 'postgresql' || norm === 'mongodb') return norm;
  return 'postgresql';
}

// Calculate derived age
export function calculateAge(dob) {
  if (!dob) return 0;
  const birthDate = new Date(dob);
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Check database connection status
export async function getDbStatus(dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  let liveConnected = false;

  if (normType === 'postgresql') {
    liveConnected = await testPostgresConnection();
  } else if (normType === 'mongodb') {
    liveConnected = await testMongoDBConnection();
  }

  return {
    dbType: normType,
    mode: liveConnected ? 'LIVE_DATABASE' : 'EMULATED_STORAGE',
    liveConnected
  };
}

// ---------------------------------------------------
// USER & AUTH OPERATIONS
// ---------------------------------------------------

export async function findUserByEmail(email, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    return await db.collection('users').findOne({ email });
  }

  // Memory fallback
  const store = getStore(dbType);
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO users (user_id, email, password_hash, role, ref_id) VALUES ($1, $2, $3, $4, $5)',
      [userData.user_id, userData.email, userData.password_hash, userData.role, userData.ref_id]
    );
    return userData;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('users').insertOne(userData);
    return userData;
  }

  const store = getStore(dbType);
  store.users.push(userData);
  return userData;
}

export async function createCustomer(custData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO customers (customer_id, user_id, email, first_name, middle_name, last_name, date_of_birth, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [custData.customer_id, custData.user_id, custData.email, custData.first_name, custData.middle_name, custData.last_name, custData.date_of_birth, custData.phone]
    );
    await pool.query('INSERT INTO carts (cart_id, customer_id) VALUES ($1, $2)', [`cart-${custData.customer_id}`, custData.customer_id]);
    return custData;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('customers').insertOne(custData);
    await db.collection('carts').insertOne({ cart_id: `cart-${custData.customer_id}`, customer_id: custData.customer_id });
    return custData;
  }

  const store = getStore(dbType);
  store.customers.push(custData);
  store.carts.push({ cart_id: `cart-${custData.customer_id}`, customer_id: custData.customer_id });
  return custData;
}

export async function createSeller(sellerData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO sellers (seller_id, user_id, name, email, phone) VALUES ($1, $2, $3, $4, $5)',
      [sellerData.seller_id, sellerData.user_id, sellerData.name, sellerData.email, sellerData.phone]
    );
    return sellerData;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('sellers').insertOne(sellerData);
    return sellerData;
  }

  const store = getStore(dbType);
  store.sellers.push(sellerData);
  return sellerData;
}

export async function getCustomerById(customerId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [customerId]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], age: calculateAge(res.rows[0].date_of_birth) };
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    const cust = await db.collection('customers').findOne({ customer_id: customerId });
    if (!cust) return null;
    return { ...cust, age: calculateAge(cust.date_of_birth) };
  }

  const store = getStore(dbType);
  const cust = store.customers.find(c => c.customer_id === customerId);
  if (!cust) return null;
  return { ...cust, age: calculateAge(cust.date_of_birth) };
}

export async function getSellerById(sellerId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  let seller = null;

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM sellers WHERE seller_id = $1', [sellerId]);
    seller = res.rows[0] || null;
  } else if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    seller = await db.collection('sellers').findOne({ seller_id: sellerId });
  } else {
    seller = store.sellers.find(s => s.seller_id === sellerId) || null;
  }

  if (!seller) return null;

  // Calculate derived total_sales
  const sellerProducts = store.products.filter(p => p.seller_id === sellerId);
  const sellerProdIds = new Set(sellerProducts.map(p => p.product_id));
  let totalSales = 0;
  store.order_item.forEach(oi => {
    if (sellerProdIds.has(oi.product_id)) {
      totalSales += (parseFloat(oi.unit_price) * parseInt(oi.quantity));
    }
  });

  return { ...seller, total_sales: totalSales };
}

export async function createEmployee(empData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO employees (employee_id, user_id, name, email, phone, address, department, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [
        empData.employee_id,
        empData.user_id,
        empData.name,
        empData.email,
        empData.phone,
        empData.address || '',
        empData.department || 'Operations',
        empData.status || 'Active'
      ]
    );
    return empData;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('employees').insertOne(empData);
    return empData;
  }

  const store = getStore(dbType);
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));
  store.employees.push(empData);
  return empData;
}

export async function createEmployeeWithUser(empData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);

  // Check email uniqueness
  const existingUser = await findUserByEmail(empData.email, dbType);
  if (existingUser) {
    throw new Error(`An account with email ${empData.email} already exists.`);
  }

  const employeeId = empData.employee_id || `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
  const userId = `usr-emp-${Date.now()}`;
  const passwordHash = await bcrypt.hash(empData.password || 'password123', 10);
  const status = empData.status || 'Active';
  const isActive = status === 'Active';

  const userRecord = {
    user_id: userId,
    email: empData.email,
    password_hash: passwordHash,
    role: 'EMPLOYEE',
    ref_id: employeeId,
    is_active: isActive,
    created_at: new Date().toISOString()
  };

  const employeeRecord = {
    employee_id: employeeId,
    user_id: userId,
    name: empData.name,
    email: empData.email,
    phone: empData.phone,
    address: empData.address || '',
    department: empData.department || 'Operations & Fulfillment',
    status: status
  };

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO users (user_id, email, password_hash, role, ref_id, is_active, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [userId, empData.email, passwordHash, 'EMPLOYEE', employeeId, isActive]
    );
    await pool.query(
      'INSERT INTO employees (employee_id, user_id, name, email, phone, address, department, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [employeeId, userId, empData.name, empData.email, empData.phone, employeeRecord.address, employeeRecord.department, status]
    );
    return { ...employeeRecord, is_active: isActive };
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('users').insertOne(userRecord);
    await db.collection('employees').insertOne(employeeRecord);
    return { ...employeeRecord, is_active: isActive };
  }

  // Memory fallback
  store.users.push(userRecord);
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));
  store.employees.push(employeeRecord);

  return { ...employeeRecord, is_active: isActive };
}

export async function getEmployeeById(employeeId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));

  let employee = null;

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query(`
      SELECT e.*, u.is_active, u.created_at as account_created
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.user_id
      WHERE e.employee_id = $1
    `, [employeeId]);
    employee = res.rows[0] || null;
  } else if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    const emp = await db.collection('employees').findOne({ employee_id: employeeId });
    if (emp) {
      const user = await db.collection('users').findOne({ $or: [{ ref_id: employeeId }, { user_id: emp.user_id }] });
      employee = {
        ...emp,
        is_active: user ? (user.is_active !== false) : (emp.status !== 'Inactive'),
        account_created: user?.created_at
      };
    }
  } else {
    const emp = store.employees.find(e => e.employee_id === employeeId) || null;
    if (emp) {
      const user = store.users.find(u => u.ref_id === employeeId || u.user_id === emp.user_id);
      employee = {
        ...emp,
        is_active: user ? (user.is_active !== false) : (emp.status !== 'Inactive'),
        account_created: user?.created_at || '2026-01-01 08:00:00'
      };
    }
  }

  return employee;
}

export async function getAllEmployees(dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query(`
      SELECT e.*, u.is_active, u.created_at as account_created
      FROM employees e
      LEFT JOIN users u ON e.user_id = u.user_id
      ORDER BY e.employee_id ASC
    `);
    return res.rows.map(r => ({
      ...r,
      status: r.status || (r.is_active === false ? 'Inactive' : 'Active')
    }));
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    const emps = await db.collection('employees').find().toArray();
    const users = await db.collection('users').find({ role: 'EMPLOYEE' }).toArray();
    return emps.map(e => {
      const u = users.find(usr => usr.user_id === e.user_id || usr.ref_id === e.employee_id);
      return {
        ...e,
        is_active: u ? (u.is_active !== false) : (e.status !== 'Inactive'),
        status: e.status || ((u && u.is_active === false) ? 'Inactive' : 'Active'),
        account_created: u ? u.created_at : undefined
      };
    });
  }

  return store.employees.map(e => {
    const u = store.users.find(usr => usr.user_id === e.user_id || usr.ref_id === e.employee_id);
    return {
      ...e,
      address: e.address || '',
      department: e.department || 'Operations & Fulfillment',
      is_active: u ? (u.is_active !== false) : (e.status !== 'Inactive'),
      status: e.status || ((u && u.is_active === false) ? 'Inactive' : 'Active'),
      account_created: u ? u.created_at : '2026-01-01 08:00:00'
    };
  });
}

export async function updateEmployee(employeeId, updates, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);

  const existing = await getEmployeeById(employeeId, dbType);
  if (!existing) {
    throw new Error(`Employee with ID ${employeeId} not found.`);
  }

  const updatedName = updates.name !== undefined ? updates.name : existing.name;
  const updatedPhone = updates.phone !== undefined ? updates.phone : existing.phone;
  const updatedAddress = updates.address !== undefined ? updates.address : (existing.address || '');
  const updatedDept = updates.department !== undefined ? updates.department : (existing.department || 'Operations');
  const updatedStatus = updates.status !== undefined ? updates.status : (existing.status || 'Active');
  const isActive = updatedStatus === 'Active';

  let newPasswordHash = null;
  if (updates.password && updates.password.trim().length >= 6) {
    newPasswordHash = await bcrypt.hash(updates.password.trim(), 10);
  }

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(`
      UPDATE employees
      SET name = $1, phone = $2, address = $3, department = $4, status = $5
      WHERE employee_id = $6
    `, [updatedName, updatedPhone, updatedAddress, updatedDept, updatedStatus, employeeId]);

    if (newPasswordHash) {
      await pool.query(
        'UPDATE users SET password_hash = $1, is_active = $2 WHERE ref_id = $3 OR user_id = $4',
        [newPasswordHash, isActive, employeeId, existing.user_id]
      );
    } else {
      await pool.query(
        'UPDATE users SET is_active = $1 WHERE ref_id = $2 OR user_id = $3',
        [isActive, employeeId, existing.user_id]
      );
    }

    return await getEmployeeById(employeeId, dbType);
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('employees').updateOne(
      { employee_id: employeeId },
      { $set: { name: updatedName, phone: updatedPhone, address: updatedAddress, department: updatedDept, status: updatedStatus } }
    );
    const userUpdate = { is_active: isActive };
    if (newPasswordHash) userUpdate.password_hash = newPasswordHash;
    await db.collection('users').updateOne(
      { $or: [{ ref_id: employeeId }, { user_id: existing.user_id }] },
      { $set: userUpdate }
    );
    return await getEmployeeById(employeeId, dbType);
  }

  // Memory fallback
  const idx = store.employees.findIndex(e => e.employee_id === employeeId);
  if (idx !== -1) {
    store.employees[idx] = {
      ...store.employees[idx],
      name: updatedName,
      phone: updatedPhone,
      address: updatedAddress,
      department: updatedDept,
      status: updatedStatus
    };
  }

  const uIdx = store.users.findIndex(u => u.ref_id === employeeId || u.user_id === existing.user_id);
  if (uIdx !== -1) {
    store.users[uIdx].is_active = isActive;
    if (newPasswordHash) store.users[uIdx].password_hash = newPasswordHash;
  }

  return await getEmployeeById(employeeId, dbType);
}

export async function updateEmployeeStatus(employeeId, status, dbType = 'postgresql') {
  return await updateEmployee(employeeId, { status }, dbType);
}

export async function deleteEmployee(employeeId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);

  const existing = await getEmployeeById(employeeId, dbType);
  if (!existing) return false;

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query('DELETE FROM employees WHERE employee_id = $1', [employeeId]);
    await pool.query('DELETE FROM users WHERE ref_id = $1 OR user_id = $2', [employeeId, existing.user_id]);
    return true;
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('employees').deleteOne({ employee_id: employeeId });
    await db.collection('users').deleteOne({ $or: [{ ref_id: employeeId }, { user_id: existing.user_id }] });
    return true;
  }

  // Memory fallback
  store.employees = store.employees.filter(e => e.employee_id !== employeeId);
  store.users = store.users.filter(u => u.ref_id !== employeeId && u.user_id !== existing.user_id);
  return true;
}

export async function getAllUsers(dbType = 'postgresql') {
  const store = getStore(dbType);

  return store.users.map(u => {
    let name = u.email;
    if (u.role === 'CUSTOMER') {
      const c = store.customers.find(cust => cust.customer_id === u.ref_id);
      if (c) name = `${c.first_name} ${c.last_name}`;
    } else if (u.role === 'SELLER') {
      const s = store.sellers.find(sel => sel.seller_id === u.ref_id);
      if (s) name = s.name;
    } else if (u.role === 'EMPLOYEE') {
      const e = (store.employees || []).find(emp => emp.employee_id === u.ref_id);
      if (e) name = e.name;
    } else if (u.role === 'ADMIN') {
      name = 'System Administrator';
    }

    return {
      user_id: u.user_id,
      email: u.email,
      role: u.role,
      ref_id: u.ref_id,
      name,
      is_active: u.is_active !== false,
      created_at: u.created_at || new Date().toISOString()
    };
  });
}

export async function deactivateUser(userId, dbType = 'postgresql') {
  const store = getStore(dbType);

  const user = store.users.find(u => u.user_id === userId);
  if (user) {
    user.is_active = false;
    user.status = 'DELETED';
    return true;
  }
  return false;
}


// ---------------------------------------------------
// PRODUCTS OPERATIONS
// ---------------------------------------------------

export async function getAllProducts(filters = {}, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  let productsList = [];

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query(`
      SELECT p.*, c.category_name, s.name as seller_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
    `);
    productsList = res.rows;
  } else {
    productsList = store.products.map(p => {
      const cat = store.categories.find(c => c.category_id === p.category_id);
      const sel = store.sellers.find(s => s.seller_id === p.seller_id);
      return {
        ...p,
        category_name: cat ? cat.category_name : '',
        seller_name: sel ? sel.name : ''
      };
    });
  }

  // Filter application
  let result = [...productsList];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(p => p.product_name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s));
  }
  if (filters.category_id) {
    result = result.filter(p => p.category_id === filters.category_id);
  }
  if (filters.seller_id) {
    result = result.filter(p => p.seller_id === filters.seller_id);
  }
  if (filters.brand) {
    result = result.filter(p => p.brand.toLowerCase() === filters.brand.toLowerCase());
  }
  if (filters.min_price) {
    result = result.filter(p => parseFloat(p.mrp) >= parseFloat(filters.min_price));
  }
  if (filters.max_price) {
    result = result.filter(p => parseFloat(p.mrp) <= parseFloat(filters.max_price));
  }
  if (filters.active_only !== undefined && filters.active_only !== 'false') {
    result = result.filter(p => Boolean(p.is_active));
  }

  // Sorting
  if (filters.sort_by === 'price_asc') {
    result.sort((a, b) => parseFloat(a.mrp) - parseFloat(b.mrp));
  } else if (filters.sort_by === 'price_desc') {
    result.sort((a, b) => parseFloat(b.mrp) - parseFloat(a.mrp));
  } else if (filters.sort_by === 'name_asc') {
    result.sort((a, b) => a.product_name.localeCompare(b.product_name));
  }

  return result;
}

export async function getProductById(productId, dbType = 'postgresql') {
  const products = await getAllProducts({}, dbType);
  const prod = products.find(p => p.product_id === productId);
  if (!prod) return null;

  // Fetch reviews for rating
  const reviews = await getReviewsByProductId(productId, dbType);
  const avgRating = reviews.length > 0 
    ? parseFloat((reviews.reduce((acc, r) => acc + parseInt(r.rating), 0) / reviews.length).toFixed(1))
    : 0;

  return {
    ...prod,
    reviews,
    avg_rating: avgRating,
    total_reviews: reviews.length
  };
}

export async function createProduct(prodData, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO products (product_id, seller_id, category_id, product_name, brand, mrp, stock_qty, is_active, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [prodData.product_id, prodData.seller_id, prodData.category_id, prodData.product_name, prodData.brand, prodData.mrp, prodData.stock_qty, prodData.is_active ?? true, prodData.image_url || '']
    );
    return prodData;
  }

  const store = getStore(dbType);
  store.products.push(prodData);
  return prodData;
}

export async function updateProduct(productId, updates, dbType = 'postgresql') {
  const store = getStore(dbType);
  const idx = store.products.findIndex(p => p.product_id === productId);
  if (idx !== -1) {
    store.products[idx] = { ...store.products[idx], ...updates };
    return store.products[idx];
  }
  return null;
}

export async function deleteProduct(productId, dbType = 'postgresql') {
  const store = getStore(dbType);
  store.products = store.products.filter(p => p.product_id !== productId);
  return true;
}

// ---------------------------------------------------
// CATEGORY OPERATIONS
// ---------------------------------------------------

export async function getAllCategories(dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.categories;
}

export async function createCategory(catData, dbType = 'postgresql') {
  const store = getStore(dbType);
  store.categories.push(catData);
  return catData;
}

export async function updateCategory(categoryId, updates, dbType = 'postgresql') {
  const store = getStore(dbType);
  const idx = store.categories.findIndex(c => c.category_id === categoryId);
  if (idx !== -1) {
    store.categories[idx] = { ...store.categories[idx], ...updates };
    return store.categories[idx];
  }
  return null;
}

export async function deleteCategory(categoryId, dbType = 'postgresql') {
  const store = getStore(dbType);
  store.categories = store.categories.filter(c => c.category_id !== categoryId);
  return true;
}

// ---------------------------------------------------
// CART OPERATIONS (Includes derived grand_total & items_total)
// ---------------------------------------------------

export async function getCartByCustomerId(customerId, dbType = 'postgresql') {
  const store = getStore(dbType);

  let cart = store.carts.find(c => c.customer_id === customerId);
  if (!cart) {
    cart = { cart_id: `cart-${customerId}`, customer_id: customerId };
    store.carts.push(cart);
  }

  const items = store.cart_item.filter(ci => ci.cart_id === cart.cart_id);
  const detailedItems = items.map(ci => {
    const product = store.products.find(p => p.product_id === ci.product_id);
    const unitPrice = product ? parseFloat(product.mrp) : 0;
    const subtotal = unitPrice * ci.quantity;
    return {
      cart_id: ci.cart_id,
      product_id: ci.product_id,
      quantity: ci.quantity,
      product,
      unit_price: unitPrice,
      subtotal
    };
  });

  // Calculate derived attributes
  const items_total = detailedItems.reduce((acc, item) => acc + item.quantity, 0);
  const grand_total = detailedItems.reduce((acc, item) => acc + item.subtotal, 0);

  return {
    cart_id: cart.cart_id,
    customer_id: customerId,
    items: detailedItems,
    items_total, // derived
    grand_total: parseFloat(grand_total.toFixed(2)) // derived
  };
}

export async function addToCart(customerId, productId, quantity = 1, dbType = 'postgresql') {
  const store = getStore(dbType);

  const cart = await getCartByCustomerId(customerId, dbType);
  const existing = store.cart_item.find(ci => ci.cart_id === cart.cart_id && ci.product_id === productId);

  if (existing) {
    existing.quantity += parseInt(quantity);
  } else {
    store.cart_item.push({
      cart_id: cart.cart_id,
      product_id: productId,
      quantity: parseInt(quantity)
    });
  }

  return await getCartByCustomerId(customerId, dbType);
}

export async function updateCartItemQuantity(customerId, productId, quantity, dbType = 'postgresql') {
  const store = getStore(dbType);
  const cart = await getCartByCustomerId(customerId, dbType);

  const idx = store.cart_item.findIndex(ci => ci.cart_id === cart.cart_id && ci.product_id === productId);
  if (idx !== -1) {
    if (quantity <= 0) {
      store.cart_item.splice(idx, 1);
    } else {
      store.cart_item[idx].quantity = parseInt(quantity);
    }
  }

  return await getCartByCustomerId(customerId, dbType);
}

export async function removeFromCart(customerId, productId, dbType = 'postgresql') {
  return await updateCartItemQuantity(customerId, productId, 0, dbType);
}

export async function clearCart(customerId, dbType = 'postgresql') {
  const store = getStore(dbType);
  const cart = await getCartByCustomerId(customerId, dbType);
  store.cart_item = store.cart_item.filter(ci => ci.cart_id !== cart.cart_id);
  return await getCartByCustomerId(customerId, dbType);
}

export async function mergeCartItems(customerId, items, dbType = 'postgresql') {
  const store = getStore(dbType);
  const cart = await getCartByCustomerId(customerId, dbType);
  if (!Array.isArray(items) || items.length === 0) {
    return cart;
  }

  const allProducts = await getAllProducts({}, dbType);

  for (const item of items) {
    if (!item.product_id) continue;
    const prod = allProducts.find(p => p.product_id === item.product_id);
    if (!prod || prod.is_active === false || (prod.stock_qty !== undefined && prod.stock_qty <= 0)) {
      continue;
    }

    const requestedQty = Math.max(1, parseInt(item.quantity) || 1);
    const existing = store.cart_item.find(ci => ci.cart_id === cart.cart_id && ci.product_id === item.product_id);

    if (existing) {
      const combinedQty = existing.quantity + requestedQty;
      existing.quantity = prod.stock_qty ? Math.min(combinedQty, prod.stock_qty) : combinedQty;
    } else {
      const initialQty = prod.stock_qty ? Math.min(requestedQty, prod.stock_qty) : requestedQty;
      store.cart_item.push({
        cart_id: cart.cart_id,
        product_id: item.product_id,
        quantity: initialQty
      });
    }
  }

  return await getCartByCustomerId(customerId, dbType);
}

// ---------------------------------------------------
// WISHLIST OPERATIONS
// ---------------------------------------------------

export async function getWishlistByUserId(userId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  if (!store.wishlists) store.wishlists = JSON.parse(JSON.stringify(sampleWishlists || []));

  const allProducts = await getAllProducts({}, dbType);

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query(`
      SELECT w.*, p.product_name, p.brand, p.mrp, p.stock_qty, p.image_url, p.is_active, c.category_name
      FROM wishlists w
      JOIN products p ON w.product_id = p.product_id
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
    `, [userId]);

    return res.rows.map(r => ({
      wishlist_id: r.wishlist_id,
      user_id: r.user_id,
      product_id: r.product_id,
      created_at: r.created_at,
      product: {
        product_id: r.product_id,
        product_name: r.product_name,
        brand: r.brand,
        mrp: parseFloat(r.mrp),
        stock_qty: r.stock_qty,
        image_url: r.image_url,
        is_active: r.is_active,
        category_name: r.category_name
      }
    }));
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    const rows = await db.collection('wishlists').find({ user_id: userId }).sort({ created_at: -1 }).toArray();
    return rows.map(w => {
      const prod = allProducts.find(p => p.product_id === w.product_id);
      return {
        wishlist_id: w.wishlist_id,
        user_id: w.user_id,
        product_id: w.product_id,
        created_at: w.created_at,
        product: prod || null
      };
    });
  }

  // Memory fallback
  const userItems = store.wishlists.filter(w => w.user_id === userId);
  return userItems.map(w => {
    const prod = allProducts.find(p => p.product_id === w.product_id);
    return {
      wishlist_id: w.wishlist_id,
      user_id: w.user_id,
      product_id: w.product_id,
      created_at: w.created_at || new Date().toISOString(),
      product: prod || null
    };
  });
}

export async function addToWishlist(userId, productId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  if (!store.wishlists) store.wishlists = JSON.parse(JSON.stringify(sampleWishlists || []));

  const allProducts = await getAllProducts({}, dbType);
  const prod = allProducts.find(p => p.product_id === productId);
  if (!prod) {
    throw new Error('Product not found.');
  }

  const wishlistId = `wsh-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const createdAt = new Date().toISOString();

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(`
      INSERT INTO wishlists (wishlist_id, user_id, product_id, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id, product_id) DO NOTHING
    `, [wishlistId, userId, productId]);
    return await getWishlistByUserId(userId, dbType);
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('wishlists').updateOne(
      { user_id: userId, product_id: productId },
      { $setOnInsert: { wishlist_id: wishlistId, user_id: userId, product_id: productId, created_at: createdAt } },
      { upsert: true }
    );
    return await getWishlistByUserId(userId, dbType);
  }

  // Memory fallback
  const exists = store.wishlists.some(w => w.user_id === userId && w.product_id === productId);
  if (!exists) {
    store.wishlists.push({
      wishlist_id: wishlistId,
      user_id: userId,
      product_id: productId,
      created_at: createdAt
    });
  }

  return await getWishlistByUserId(userId, dbType);
}

export async function removeFromWishlist(userId, productId, dbType = 'postgresql') {
  const normType = normalizeDbType(dbType);
  const store = getStore(dbType);
  if (!store.wishlists) store.wishlists = JSON.parse(JSON.stringify(sampleWishlists || []));

  if (normType === 'postgresql' && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query('DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    return await getWishlistByUserId(userId, dbType);
  }

  if (normType === 'mongodb' && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('wishlists').deleteOne({ user_id: userId, product_id: productId });
    return await getWishlistByUserId(userId, dbType);
  }

  // Memory fallback
  store.wishlists = store.wishlists.filter(w => !(w.user_id === userId && w.product_id === productId));
  return await getWishlistByUserId(userId, dbType);
}

export async function syncWishlist(userId, productIds, dbType = 'postgresql') {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return await getWishlistByUserId(userId, dbType);
  }

  for (const pid of productIds) {
    if (pid) {
      await addToWishlist(userId, pid, dbType);
    }
  }

  return await getWishlistByUserId(userId, dbType);
}

// ---------------------------------------------------
// ADDRESS OPERATIONS
// ---------------------------------------------------

export async function getAddressesByCustomerId(customerId, dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.addresses.filter(a => a.customer_id === customerId);
}

export async function createAddress(addrData, dbType = 'postgresql') {
  const store = getStore(dbType);

  if (addrData.is_default) {
    store.addresses.forEach(a => {
      if (a.customer_id === addrData.customer_id) a.is_default = false;
    });
  }

  store.addresses.push(addrData);
  return addrData;
}

export async function updateAddress(addressId, updates, dbType = 'postgresql') {
  const store = getStore(dbType);
  const idx = store.addresses.findIndex(a => a.address_id === addressId);
  if (idx !== -1) {
    if (updates.is_default) {
      store.addresses.forEach(a => {
        if (a.customer_id === store.addresses[idx].customer_id) a.is_default = false;
      });
    }
    store.addresses[idx] = { ...store.addresses[idx], ...updates };
    return store.addresses[idx];
  }
  return null;
}

export async function deleteAddress(addressId, dbType = 'postgresql') {
  const store = getStore(dbType);
  store.addresses = store.addresses.filter(a => a.address_id !== addressId);
  return true;
}

// ---------------------------------------------------
// ORDER & PAYMENT OPERATIONS
// ---------------------------------------------------

export async function addOrderHistoryRecord(historyData, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.order_history) store.order_history = [];

  const record = {
    history_id: `hist-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    order_id: historyData.order_id,
    action: historyData.action,
    performed_by: historyData.performed_by || 'System',
    previous_status: historyData.previous_status || null,
    new_status: historyData.new_status,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  store.order_history.push(record);
  return record;
}

export async function getOrderHistory(orderId, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.order_history) store.order_history = [];

  return store.order_history
    .filter(h => h.order_id === orderId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function createOrder(orderPayload, dbType = 'postgresql') {
  const store = getStore(dbType);

  const orderId = `ord-${Date.now()}`;
  const orderNumber = `ORD-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Get customer cart
  const cart = await getCartByCustomerId(orderPayload.customer_id, dbType);
  if (!cart.items || cart.items.length === 0) {
    throw new Error('Cannot checkout with an empty cart');
  }

  const cust = store.customers.find(c => c.customer_id === orderPayload.customer_id);
  const custEmail = cust ? cust.email : orderPayload.customer_id;
  const orderAmount = cart.grand_total;

  const orderRecord = {
    order_id: orderId,
    customer_id: orderPayload.customer_id,
    address_id: orderPayload.address_id,
    order_number: orderNumber,
    order_date: orderDate,
    shipping_date: null,
    approx_delivery_date: null,
    order_amount: orderAmount,
    order_status: 'ORDER_PLACED'
  };

  store.orders.unshift(orderRecord);

  // Add Order Items (Order -> Product M:N)
  cart.items.forEach(item => {
    store.order_item.push({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price
    });
    // Decrease stock_qty
    const prod = store.products.find(p => p.product_id === item.product_id);
    if (prod) {
      prod.stock_qty = Math.max(0, prod.stock_qty - item.quantity);
    }
  });

  // Create Payment record (Order -> Payment 1:N)
  const paymentRecord = {
    payment_id: `pay-${Date.now()}`,
    order_id: orderId,
    payment_mode: orderPayload.payment_mode || 'Credit/Debit Card',
    payment_status: 'Completed',
    amount: orderAmount,
    date_of_payment: orderDate
  };
  store.payments.unshift(paymentRecord);

  // Log order history entry
  await addOrderHistoryRecord({
    order_id: orderId,
    action: 'Order Placed by Customer',
    performed_by: custEmail,
    previous_status: null,
    new_status: 'ORDER_PLACED'
  }, dbType);

  // Clear customer cart
  await clearCart(orderPayload.customer_id, dbType);

  return {
    ...orderRecord,
    payment: paymentRecord,
    items: store.order_item.filter(oi => oi.order_id === orderId)
  };
}

export async function getAllOrders(filters = {}, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.order_history) store.order_history = [];

  let list = store.orders.map(ord => {
    const cust = store.customers.find(c => c.customer_id === ord.customer_id);
    const addr = store.addresses.find(a => a.address_id === ord.address_id);
    const items = store.order_item.filter(oi => oi.order_id === ord.order_id).map(oi => {
      const prod = store.products.find(p => p.product_id === oi.product_id);
      return { ...oi, product_name: prod ? prod.product_name : '', brand: prod ? prod.brand : '', seller_id: prod ? prod.seller_id : '', image_url: prod ? prod.image_url : '' };
    });
    const pay = store.payments.find(p => p.order_id === ord.order_id);
    const history = store.order_history
      .filter(h => h.order_id === ord.order_id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const emp = (store.employees || []).find(e => e.employee_id === ord.assigned_employee_id);

    return {
      ...ord,
      assigned_employee_id: ord.assigned_employee_id || null,
      assigned_employee_name: emp ? emp.name : (ord.assigned_employee_name || null),
      customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Customer',
      customer_email: cust ? cust.email : '',
      address: addr || null,
      payment: pay || null,
      items,
      history
    };
  });

  if (filters.assigned_employee_id) {
    list = list.filter(o => o.assigned_employee_id === filters.assigned_employee_id);
  }

  if (filters.customer_id) {
    list = list.filter(o => o.customer_id === filters.customer_id);
  }

  if (filters.seller_id) {
    // Seller only sees orders containing their items AND status is forwarded to seller (SENT_TO_SELLER, ORDER_CONFIRMED, SHIPPED, DELIVERED)
    list = list.filter(o =>
      o.items.some(item => item.seller_id === filters.seller_id) &&
      o.order_status !== 'PENDING_EMPLOYEE' &&
      o.order_status !== 'Pending Employee' &&
      o.order_status !== 'ORDER_PLACED' &&
      o.order_status !== 'Order Placed'
    );
  }

  if (filters.status) {
    list = list.filter(o => o.order_status.toUpperCase() === filters.status.toUpperCase());
  }

  return list;
}

export async function getOrderById(orderId, dbType = 'postgresql') {
  const orders = await getAllOrders({}, dbType);
  return orders.find(o => o.order_id === orderId) || null;
}

export async function assignOrderToEmployee(orderId, employeeId, performedBy = 'Staff', dbType = 'postgresql') {
  const store = getStore(dbType);
  const ord = store.orders.find(o => o.order_id === orderId);
  if (!ord) throw new Error('Order not found.');

  const emp = (store.employees || []).find(e => e.employee_id === employeeId);
  ord.assigned_employee_id = employeeId;
  ord.assigned_employee_name = emp ? emp.name : employeeId;

  await addOrderHistoryRecord({
    order_id: orderId,
    action: `Order Assigned to ${emp ? emp.name : employeeId}`,
    performed_by: performedBy,
    previous_status: ord.order_status,
    new_status: ord.order_status
  }, dbType);

  return await getOrderById(orderId, dbType);
}

export async function updateOrderStatus(orderId, status, performedBy = 'System', dbType = 'postgresql') {
  const store = getStore(dbType);
  const ord = store.orders.find(o => o.order_id === orderId);
  if (ord) {
    const prevStatus = ord.order_status;
    ord.order_status = status;
    const upperStatus = (status || '').toUpperCase();

    if (upperStatus === 'SHIPPED' || upperStatus === 'ORDER SHIPPED' || upperStatus === 'SHIPPING_REQUESTED') {
      const now = new Date();
      ord.shipping_date = now.toISOString().replace('T', ' ').substring(0, 19);
      if (!ord.approx_delivery_date) {
        const est = new Date();
        est.setDate(est.getDate() + 4);
        ord.approx_delivery_date = est.toISOString().split('T')[0];
      }
    }

    let actionText = `Order Status updated to ${status}`;
    if (upperStatus === 'SHIPPED' || upperStatus === 'ORDER SHIPPED') {
      actionText = `Order Status updated to SHIPPED (Approx Delivery: ${ord.approx_delivery_date})`;
    } else if (upperStatus === 'ORDER_CONFIRMED') {
      actionText = `Order Confirmed & Placed by Seller`;
    } else if (upperStatus === 'SENT_TO_SELLER') {
      actionText = `Forwarded to Seller by Employee`;
    } else if (upperStatus === 'DELIVERED') {
      actionText = `Order Marked as Delivered by Employee`;
    } else if (upperStatus === 'OUT_FOR_DELIVERY') {
      actionText = `Order is Out for Delivery`;
    } else if (upperStatus === 'PACKED') {
      actionText = `Order has been Packed`;
    } else if (upperStatus === 'CONFIRMED') {
      actionText = `Order Confirmed`;
    }

    await addOrderHistoryRecord({
      order_id: orderId,
      action: actionText,
      performed_by: performedBy,
      previous_status: prevStatus,
      new_status: status
    }, dbType);

    return ord;
  }
  return null;
}

export async function getAllPayments(dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.payments;
}

// ---------------------------------------------------
// REVIEWS OPERATIONS (ENHANCED)
// ---------------------------------------------------

export async function getReviewsByProductId(productId, dbType = 'postgresql') {
  const store = getStore(dbType);

  return store.reviews
    .filter(r => r.product_id === productId && r.is_hidden !== true)
    .map(r => {
      const cust = store.customers.find(c => c.customer_id === r.customer_id);
      return {
        ...r,
        customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Verified Customer',
        verified_purchase: true
      };
    });
}

export async function getAllReviews(dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.reviews.map(r => {
    const cust = store.customers.find(c => c.customer_id === r.customer_id);
    const prod = store.products.find(p => p.product_id === r.product_id);
    return {
      ...r,
      customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Customer',
      product_name: prod ? prod.product_name : 'Product',
      verified_purchase: true
    };
  });
}

export async function getReviewsByCustomerId(customerId, dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.reviews
    .filter(r => r.customer_id === customerId)
    .map(r => {
      const prod = store.products.find(p => p.product_id === r.product_id);
      return {
        ...r,
        product_name: prod ? prod.product_name : 'Product',
        product_image: prod ? prod.image_url : '',
        brand: prod ? prod.brand : ''
      };
    });
}

export async function createReview(reviewData, dbType = 'postgresql') {
  const store = getStore(dbType);

  // Verify customer has ordered this product AND order is delivered
  const orders = await getAllOrders({ customer_id: reviewData.customer_id }, dbType);
  const deliveredOrders = orders.filter(o => o.order_status === 'DELIVERED');
  const hasPurchased = deliveredOrders.some(o => o.items.some(i => i.product_id === reviewData.product_id));
  if (!hasPurchased) {
    throw new Error('You can only review products from delivered orders.');
  }

  // Check for duplicate review
  const existingReview = store.reviews.find(
    r => r.customer_id === reviewData.customer_id && r.product_id === reviewData.product_id
  );
  if (existingReview) {
    throw new Error('You have already reviewed this product. You can edit your existing review instead.');
  }

  const reviewRecord = {
    review_id: `rev-${Date.now()}`,
    customer_id: reviewData.customer_id,
    product_id: reviewData.product_id,
    rating: parseInt(reviewData.rating),
    description: reviewData.description,
    review_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    is_hidden: false,
    is_flagged: false
  };

  store.reviews.unshift(reviewRecord);
  return reviewRecord;
}

export async function updateReview(reviewId, customerId, updates, dbType = 'postgresql') {
  const store = getStore(dbType);
  const idx = store.reviews.findIndex(r => r.review_id === reviewId && r.customer_id === customerId);
  if (idx === -1) {
    throw new Error('Review not found or you do not have permission to edit it.');
  }
  
  if (updates.rating) store.reviews[idx].rating = parseInt(updates.rating);
  if (updates.description !== undefined) store.reviews[idx].description = updates.description;
  store.reviews[idx].review_date = new Date().toISOString().replace('T', ' ').substring(0, 19);
  
  return store.reviews[idx];
}

export async function deleteReview(reviewId, dbType = 'postgresql') {
  const store = getStore(dbType);
  store.reviews = store.reviews.filter(r => r.review_id !== reviewId);
  return true;
}

export async function deleteReviewByCustomer(reviewId, customerId, dbType = 'postgresql') {
  const store = getStore(dbType);
  const idx = store.reviews.findIndex(r => r.review_id === reviewId && r.customer_id === customerId);
  if (idx === -1) {
    throw new Error('Review not found or you do not have permission to delete it.');
  }
  store.reviews.splice(idx, 1);
  return true;
}

// Moderation
export async function flagReview(reviewId, moderatorEmail, reason, dbType = 'postgresql') {
  const store = getStore(dbType);
  const review = store.reviews.find(r => r.review_id === reviewId);
  if (!review) throw new Error('Review not found.');
  
  review.is_flagged = true;
  
  if (!store.feedback_moderation) store.feedback_moderation = [];
  store.feedback_moderation.push({
    moderation_id: `mod-${Date.now()}`,
    review_id: reviewId,
    action: 'FLAGGED',
    moderator: moderatorEmail,
    reason: reason || 'Flagged for review',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });
  
  return review;
}

export async function hideReview(reviewId, moderatorEmail, reason, dbType = 'postgresql') {
  const store = getStore(dbType);
  const review = store.reviews.find(r => r.review_id === reviewId);
  if (!review) throw new Error('Review not found.');
  
  review.is_hidden = true;
  
  if (!store.feedback_moderation) store.feedback_moderation = [];
  store.feedback_moderation.push({
    moderation_id: `mod-${Date.now()}`,
    review_id: reviewId,
    action: 'HIDDEN',
    moderator: moderatorEmail,
    reason: reason || 'Content violation',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });
  
  return review;
}

export async function unhideReview(reviewId, moderatorEmail, dbType = 'postgresql') {
  const store = getStore(dbType);
  const review = store.reviews.find(r => r.review_id === reviewId);
  if (!review) throw new Error('Review not found.');
  
  review.is_hidden = false;
  review.is_flagged = false;
  
  if (!store.feedback_moderation) store.feedback_moderation = [];
  store.feedback_moderation.push({
    moderation_id: `mod-${Date.now()}`,
    review_id: reviewId,
    action: 'RESTORED',
    moderator: moderatorEmail,
    reason: 'Review restored',
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });
  
  return review;
}

export async function getModerationLog(dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.feedback_moderation) store.feedback_moderation = [];
  return store.feedback_moderation.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}


// ---------------------------------------------------
// RETURN REQUEST OPERATIONS
// ---------------------------------------------------

const RETURN_WINDOW_DAYS = 30;

const VALID_RETURN_TRANSITIONS = {
  'RETURN_REQUESTED': ['RETURN_APPROVED', 'RETURN_REJECTED', 'RETURN_CANCELLED'],
  'RETURN_APPROVED': ['RETURN_SHIPPED', 'RETURN_CANCELLED'],
  'RETURN_SHIPPED': ['RETURN_IN_TRANSIT', 'RETURN_RECEIVED'],
  'RETURN_IN_TRANSIT': ['RETURN_RECEIVED'],
  'RETURN_RECEIVED': ['RETURN_COMPLETED'],
  'RETURN_REJECTED': [],
  'RETURN_CANCELLED': [],
  'RETURN_COMPLETED': []
};

function generateReturnId() {
  return `ret-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function createReturnRequest(returnData, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.return_requests) store.return_requests = [];
  if (!store.return_items) store.return_items = [];
  if (!store.return_status_history) store.return_status_history = [];

  const { customer_id, order_id, items, reason, comments } = returnData;

  // Validate order exists and belongs to customer
  const order = store.orders.find(o => o.order_id === order_id && o.customer_id === customer_id);
  if (!order) throw new Error('Order not found or does not belong to this customer.');

  // Validate order is delivered
  if (order.order_status !== 'DELIVERED') {
    throw new Error('Returns can only be requested for delivered orders.');
  }

  // Validate return window
  const deliveryRecord = store.order_history?.find(
    h => h.order_id === order_id && h.new_status === 'DELIVERED'
  );
  if (deliveryRecord) {
    const deliveredDate = new Date(deliveryRecord.timestamp);
    const now = new Date();
    const daysSinceDelivery = Math.floor((now - deliveredDate) / (1000 * 60 * 60 * 24));
    if (daysSinceDelivery > RETURN_WINDOW_DAYS) {
      throw new Error(`Return window expired. Returns must be requested within ${RETURN_WINDOW_DAYS} days of delivery.`);
    }
  }

  // Validate items
  const orderItems = store.order_item.filter(oi => oi.order_id === order_id);
  if (!items || items.length === 0) throw new Error('At least one item must be selected for return.');

  for (const returnItem of items) {
    const orderItem = orderItems.find(oi => oi.product_id === returnItem.product_id);
    if (!orderItem) throw new Error(`Product ${returnItem.product_id} was not part of this order.`);
    
    if (returnItem.quantity > orderItem.quantity) {
      throw new Error(`Cannot return more than purchased quantity for product ${returnItem.product_id}.`);
    }
    if (returnItem.quantity <= 0) {
      throw new Error('Return quantity must be at least 1.');
    }

    // Check for existing active return on same product in same order
    const existingReturn = store.return_requests.find(r => 
      r.order_id === order_id && 
      !['RETURN_REJECTED', 'RETURN_CANCELLED', 'RETURN_COMPLETED'].includes(r.return_status)
    );
    if (existingReturn) {
      const existingReturnItem = store.return_items.find(ri => 
        ri.return_id === existingReturn.return_id && ri.product_id === returnItem.product_id
      );
      if (existingReturnItem) {
        throw new Error(`An active return request already exists for product ${returnItem.product_id} on this order.`);
      }
    }
  }

  const returnId = generateReturnId();
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const returnRequest = {
    return_id: returnId,
    order_id,
    customer_id,
    reason: reason || 'Other',
    comments: comments || '',
    return_status: 'RETURN_REQUESTED',
    request_date: now,
    approval_date: null,
    rejection_reason: null,
    shipment_date: null,
    courier_name: null,
    tracking_number: null,
    received_date: null,
    completed_date: null,
    refund_status: 'PENDING',
    refund_amount: 0
  };

  // Calculate refund amount
  let refundAmount = 0;
  const returnItemRecords = items.map(item => {
    const orderItem = orderItems.find(oi => oi.product_id === item.product_id);
    const prod = store.products.find(p => p.product_id === item.product_id);
    const unitPrice = orderItem ? parseFloat(orderItem.unit_price) : 0;
    const itemRefund = unitPrice * item.quantity;
    refundAmount += itemRefund;

    return {
      return_item_id: `ri-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      return_id: returnId,
      product_id: item.product_id,
      product_name: prod ? prod.product_name : '',
      brand: prod ? prod.brand : '',
      image_url: prod ? prod.image_url : '',
      seller_id: prod ? prod.seller_id : '',
      quantity: item.quantity,
      unit_price: unitPrice,
      refund_amount: itemRefund
    };
  });

  returnRequest.refund_amount = parseFloat(refundAmount.toFixed(2));
  store.return_requests.push(returnRequest);
  store.return_items.push(...returnItemRecords);

  // Add status history
  store.return_status_history.push({
    history_id: `rsh-${Date.now()}`,
    return_id: returnId,
    status: 'RETURN_REQUESTED',
    performed_by: customer_id,
    timestamp: now,
    notes: `Return requested: ${reason}`
  });

  // Create notification for employees
  await createNotification({
    recipient_role: 'EMPLOYEE',
    type: 'RETURN_REQUEST',
    title: 'New Return Request',
    message: `Customer has submitted a return request (${returnId}) for order ${order.order_number}.`,
    reference_id: returnId,
    reference_type: 'RETURN'
  }, dbType);

  return { ...returnRequest, items: returnItemRecords };
}

export async function getReturnRequests(filters = {}, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.return_requests) store.return_requests = [];
  if (!store.return_items) store.return_items = [];

  let requests = store.return_requests.map(rr => {
    const order = store.orders.find(o => o.order_id === rr.order_id);
    const cust = store.customers.find(c => c.customer_id === rr.customer_id);
    const items = (store.return_items || []).filter(ri => ri.return_id === rr.return_id);
    const statusHistory = (store.return_status_history || [])
      .filter(h => h.return_id === rr.return_id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      ...rr,
      order_number: order ? order.order_number : '',
      order_date: order ? order.order_date : '',
      customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Customer',
      customer_email: cust ? cust.email : '',
      items,
      status_history: statusHistory
    };
  });

  if (filters.customer_id) {
    requests = requests.filter(r => r.customer_id === filters.customer_id);
  }

  if (filters.seller_id) {
    // Show only returns that have items belonging to this seller AND are approved+
    requests = requests.filter(r => {
      const sellerItems = r.items.filter(i => i.seller_id === filters.seller_id);
      if (sellerItems.length === 0) return false;
      // Seller can see after employee approval
      return !['RETURN_REQUESTED'].includes(r.return_status);
    });
    // Filter items to only show this seller's items
    requests = requests.map(r => ({
      ...r,
      items: r.items.filter(i => i.seller_id === filters.seller_id)
    }));
  }

  if (filters.status) {
    requests = requests.filter(r => r.return_status === filters.status);
  }

  return requests.sort((a, b) => new Date(b.request_date) - new Date(a.request_date));
}

export async function getReturnById(returnId, dbType = 'postgresql') {
  const requests = await getReturnRequests({}, dbType);
  return requests.find(r => r.return_id === returnId) || null;
}

export async function updateReturnStatus(returnId, newStatus, performedBy, data = {}, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.return_requests) store.return_requests = [];
  if (!store.return_status_history) store.return_status_history = [];

  const returnReq = store.return_requests.find(r => r.return_id === returnId);
  if (!returnReq) throw new Error('Return request not found.');

  // Validate transition
  const currentStatus = returnReq.return_status;
  const validNext = VALID_RETURN_TRANSITIONS[currentStatus] || [];
  if (!validNext.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}. Valid transitions: ${validNext.join(', ') || 'none'}.`);
  }

  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  returnReq.return_status = newStatus;

  // Handle specific status transitions
  if (newStatus === 'RETURN_APPROVED') {
    returnReq.approval_date = now;

    await createNotification({
      recipient_id: returnReq.customer_id,
      recipient_role: 'CUSTOMER',
      type: 'RETURN_APPROVED',
      title: 'Return Request Approved',
      message: `Your return request (${returnId}) has been approved. You can now ship the product back.`,
      reference_id: returnId,
      reference_type: 'RETURN'
    }, dbType);
  }

  if (newStatus === 'RETURN_REJECTED') {
    returnReq.rejection_reason = data.rejection_reason || 'Request did not meet return policy requirements.';
    returnReq.refund_status = 'NOT_APPLICABLE';

    await createNotification({
      recipient_id: returnReq.customer_id,
      recipient_role: 'CUSTOMER',
      type: 'RETURN_REJECTED',
      title: 'Return Request Rejected',
      message: `Your return request (${returnId}) has been rejected. Reason: ${returnReq.rejection_reason}`,
      reference_id: returnId,
      reference_type: 'RETURN'
    }, dbType);
  }

  if (newStatus === 'RETURN_SHIPPED') {
    returnReq.shipment_date = now;
    returnReq.courier_name = data.courier_name || null;
    returnReq.tracking_number = data.tracking_number || null;

    await createNotification({
      recipient_role: 'EMPLOYEE',
      type: 'RETURN_SHIPPED',
      title: 'Return Shipment Initiated',
      message: `Customer has shipped return (${returnId}). Courier: ${data.courier_name || 'N/A'}, Tracking: ${data.tracking_number || 'N/A'}.`,
      reference_id: returnId,
      reference_type: 'RETURN'
    }, dbType);

    // Also notify relevant sellers
    const returnItems = (store.return_items || []).filter(ri => ri.return_id === returnId);
    const sellerIds = [...new Set(returnItems.map(ri => ri.seller_id))];
    for (const sellerId of sellerIds) {
      await createNotification({
        recipient_id: sellerId,
        recipient_role: 'SELLER',
        type: 'RETURN_SHIPPED',
        title: 'Return Shipment Incoming',
        message: `A customer has shipped a return (${returnId}) for your products.`,
        reference_id: returnId,
        reference_type: 'RETURN'
      }, dbType);
    }
  }

  if (newStatus === 'RETURN_IN_TRANSIT') {
    // Status update only
  }

  if (newStatus === 'RETURN_RECEIVED') {
    returnReq.received_date = now;

    await createNotification({
      recipient_id: returnReq.customer_id,
      recipient_role: 'CUSTOMER',
      type: 'RETURN_RECEIVED',
      title: 'Return Received',
      message: `Your returned product (${returnId}) has been received. The return will be finalized shortly.`,
      reference_id: returnId,
      reference_type: 'RETURN'
    }, dbType);
  }

  if (newStatus === 'RETURN_COMPLETED') {
    returnReq.completed_date = now;
    returnReq.refund_status = 'REFUND_INITIATED';

    // Restore inventory
    const returnItems = (store.return_items || []).filter(ri => ri.return_id === returnId);
    returnItems.forEach(ri => {
      const prod = store.products.find(p => p.product_id === ri.product_id);
      if (prod) {
        prod.stock_qty += ri.quantity;
      }
    });

    await createNotification({
      recipient_id: returnReq.customer_id,
      recipient_role: 'CUSTOMER',
      type: 'RETURN_COMPLETED',
      title: 'Return Completed',
      message: `Your return (${returnId}) has been completed. Refund of $${returnReq.refund_amount.toFixed(2)} has been initiated.`,
      reference_id: returnId,
      reference_type: 'RETURN'
    }, dbType);
  }

  if (newStatus === 'RETURN_CANCELLED') {
    returnReq.refund_status = 'NOT_APPLICABLE';
  }

  // Add status history
  store.return_status_history.push({
    history_id: `rsh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    return_id: returnId,
    status: newStatus,
    performed_by: performedBy,
    timestamp: now,
    notes: data.notes || `Status changed to ${newStatus}`
  });

  return returnReq;
}


// ---------------------------------------------------
// NOTIFICATIONS OPERATIONS
// ---------------------------------------------------

export async function createNotification(notifData, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.notifications) store.notifications = [];

  const notification = {
    notification_id: `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    recipient_id: notifData.recipient_id || null,
    recipient_role: notifData.recipient_role || null,
    type: notifData.type,
    title: notifData.title,
    message: notifData.message,
    reference_id: notifData.reference_id || null,
    reference_type: notifData.reference_type || null,
    is_read: false,
    created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  store.notifications.push(notification);
  return notification;
}

export async function getNotifications(filters = {}, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.notifications) store.notifications = [];

  let notifs = [...store.notifications];

  if (filters.recipient_id) {
    notifs = notifs.filter(n => 
      n.recipient_id === filters.recipient_id || 
      (n.recipient_role && n.recipient_role === filters.role && !n.recipient_id)
    );
  } else if (filters.role) {
    notifs = notifs.filter(n => 
      n.recipient_role === filters.role || 
      n.recipient_id === filters.ref_id
    );
  }

  return notifs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export async function markNotificationRead(notificationId, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.notifications) store.notifications = [];

  const notif = store.notifications.find(n => n.notification_id === notificationId);
  if (notif) {
    notif.is_read = true;
    return notif;
  }
  return null;
}

export async function markAllNotificationsRead(filters = {}, dbType = 'postgresql') {
  const store = getStore(dbType);
  if (!store.notifications) store.notifications = [];

  store.notifications.forEach(n => {
    if (filters.recipient_id && (n.recipient_id === filters.recipient_id || n.recipient_role === filters.role)) {
      n.is_read = true;
    } else if (filters.role && (n.recipient_role === filters.role || n.recipient_id === filters.ref_id)) {
      n.is_read = true;
    }
  });

  return true;
}


// ---------------------------------------------------
// CUSTOMERS & SELLERS LIST & STATS
// ---------------------------------------------------

export async function getAllCustomers(dbType = 'postgresql') {
  const store = getStore(dbType);
  return store.customers.map(c => ({
    ...c,
    age: calculateAge(c.date_of_birth)
  }));
}

export async function getAllSellers(dbType = 'postgresql') {
  const store = getStore(dbType);
  return Promise.all(store.sellers.map(s => getSellerById(s.seller_id, dbType)));
}

export async function getAdminStats(dbType = 'postgresql') {
  const store = getStore(dbType);

  const totalCustomers = store.customers.length;
  const totalSellers = store.sellers.length;
  const totalEmployees = (store.employees || []).length;
  const totalProducts = store.products.length;
  const totalOrders = store.orders.length;
  const pendingOrders = store.orders.filter(o => o.order_status === 'Pending').length;
  const totalRevenue = store.orders.reduce((acc, o) => acc + parseFloat(o.order_amount), 0);
  const totalReturns = (store.return_requests || []).length;
  const pendingReturns = (store.return_requests || []).filter(r => r.return_status === 'RETURN_REQUESTED').length;
  const totalReviews = store.reviews.length;

  return {
    totalCustomers,
    totalSellers,
    totalEmployees,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    totalReturns,
    pendingReturns,
    totalReviews,
    activeDatabase: normalizeDbType(dbType).toUpperCase()
  };
}
