import { getMySQLPool, testMySQLConnection } from '../database/mysql.js';
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
  sampleOrderHistory
} from '../../database/seedData.js';

// In-Memory Storage Instances for seamless demo mode per database target
const memoryStores = {
  mysql: createSeedSnapshot(),
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
    order_history: JSON.parse(JSON.stringify(sampleOrderHistory || []))
  };
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
export async function getDbStatus(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  let liveConnected = false;

  if (normType === 'mysql') {
    liveConnected = await testMySQLConnection();
  } else if (normType === 'postgresql' || normType === 'postgres') {
    liveConnected = await testPostgresConnection();
  } else if (normType === 'mongodb' || normType === 'mongo') {
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

export async function findUserByEmail(email, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  
  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    return await db.collection('users').findOne({ email });
  }

  // Memory fallback
  const store = memoryStores[normType] || memoryStores.mysql;
  return store.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function createUser(userData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    await pool.query(
      'INSERT INTO users (user_id, email, password_hash, role, ref_id) VALUES (?, ?, ?, ?, ?)',
      [userData.user_id, userData.email, userData.password_hash, userData.role, userData.ref_id]
    );
    return userData;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO users (user_id, email, password_hash, role, ref_id) VALUES ($1, $2, $3, $4, $5)',
      [userData.user_id, userData.email, userData.password_hash, userData.role, userData.ref_id]
    );
    return userData;
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('users').insertOne(userData);
    return userData;
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  store.users.push(userData);
  return userData;
}

export async function createCustomer(custData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    await pool.query(
      'INSERT INTO customers (customer_id, user_id, email, first_name, middle_name, last_name, date_of_birth, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [custData.customer_id, custData.user_id, custData.email, custData.first_name, custData.middle_name, custData.last_name, custData.date_of_birth, custData.phone]
    );
    // Automatically initialize cart
    await pool.query('INSERT INTO carts (cart_id, customer_id) VALUES (?, ?)', [`cart-${custData.customer_id}`, custData.customer_id]);
    return custData;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO customers (customer_id, user_id, email, first_name, middle_name, last_name, date_of_birth, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [custData.customer_id, custData.user_id, custData.email, custData.first_name, custData.middle_name, custData.last_name, custData.date_of_birth, custData.phone]
    );
    await pool.query('INSERT INTO carts (cart_id, customer_id) VALUES ($1, $2)', [`cart-${custData.customer_id}`, custData.customer_id]);
    return custData;
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('customers').insertOne(custData);
    await db.collection('carts').insertOne({ cart_id: `cart-${custData.customer_id}`, customer_id: custData.customer_id });
    return custData;
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  store.customers.push(custData);
  store.carts.push({ cart_id: `cart-${custData.customer_id}`, customer_id: custData.customer_id });
  return custData;
}

export async function createSeller(sellerData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    await pool.query(
      'INSERT INTO sellers (seller_id, user_id, name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [sellerData.seller_id, sellerData.user_id, sellerData.name, sellerData.email, sellerData.phone]
    );
    return sellerData;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO sellers (seller_id, user_id, name, email, phone) VALUES ($1, $2, $3, $4, $5)',
      [sellerData.seller_id, sellerData.user_id, sellerData.name, sellerData.email, sellerData.phone]
    );
    return sellerData;
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('sellers').insertOne(sellerData);
    return sellerData;
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  store.sellers.push(sellerData);
  return sellerData;
}

export async function getCustomerById(customerId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM customers WHERE customer_id = ?', [customerId]);
    if (!rows[0]) return null;
    return { ...rows[0], age: calculateAge(rows[0].date_of_birth) };
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [customerId]);
    if (!res.rows[0]) return null;
    return { ...res.rows[0], age: calculateAge(res.rows[0].date_of_birth) };
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    const cust = await db.collection('customers').findOne({ customer_id: customerId });
    if (!cust) return null;
    return { ...cust, age: calculateAge(cust.date_of_birth) };
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  const cust = store.customers.find(c => c.customer_id === customerId);
  if (!cust) return null;
  return { ...cust, age: calculateAge(cust.date_of_birth) };
}

export async function getSellerById(sellerId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  const store = memoryStores[normType] || memoryStores.mysql;
  let seller = null;

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM sellers WHERE seller_id = ?', [sellerId]);
    seller = rows[0] || null;
  } else if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM sellers WHERE seller_id = $1', [sellerId]);
    seller = res.rows[0] || null;
  } else if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
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

export async function createEmployee(empData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    await pool.query(
      'INSERT INTO employees (employee_id, user_id, name, email, phone) VALUES (?, ?, ?, ?, ?)',
      [empData.employee_id, empData.user_id, empData.name, empData.email, empData.phone]
    );
    return empData;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO employees (employee_id, user_id, name, email, phone) VALUES ($1, $2, $3, $4, $5)',
      [empData.employee_id, empData.user_id, empData.name, empData.email, empData.phone]
    );
    return empData;
  }

  if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    await db.collection('employees').insertOne(empData);
    return empData;
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));
  store.employees.push(empData);
  return empData;
}

export async function getEmployeeById(employeeId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));

  let employee = null;

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    const [rows] = await pool.query('SELECT * FROM employees WHERE employee_id = ?', [employeeId]);
    employee = rows[0] || null;
  } else if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    const res = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [employeeId]);
    employee = res.rows[0] || null;
  } else if ((normType === 'mongodb' || normType === 'mongo') && await testMongoDBConnection()) {
    const db = await getMongoDB();
    employee = await db.collection('employees').findOne({ employee_id: employeeId });
  } else {
    employee = store.employees.find(e => e.employee_id === employeeId) || null;
  }

  return employee;
}

export async function getAllEmployees(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  if (!store.employees) store.employees = JSON.parse(JSON.stringify(sampleEmployees || []));
  return store.employees;
}

export async function getAllUsers(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

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

export async function deactivateUser(userId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

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

export async function getAllProducts(filters = {}, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  let productsList = [];

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    const [rows] = await pool.query(`
      SELECT p.*, c.category_name, s.name as seller_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN sellers s ON p.seller_id = s.seller_id
    `);
    productsList = rows;
  } else if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
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

export async function getProductById(productId, dbType = 'mysql') {
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
    avg_rating: avgRating
  };
}

export async function createProduct(prodData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();

  if (normType === 'mysql' && await testMySQLConnection()) {
    const pool = getMySQLPool();
    await pool.query(
      'INSERT INTO products (product_id, seller_id, category_id, product_name, brand, mrp, stock_qty, is_active, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [prodData.product_id, prodData.seller_id, prodData.category_id, prodData.product_name, prodData.brand, prodData.mrp, prodData.stock_qty, prodData.is_active ?? true, prodData.image_url || '']
    );
    return prodData;
  }

  if ((normType === 'postgresql' || normType === 'postgres') && await testPostgresConnection()) {
    const pool = getPostgresPool();
    await pool.query(
      'INSERT INTO products (product_id, seller_id, category_id, product_name, brand, mrp, stock_qty, is_active, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [prodData.product_id, prodData.seller_id, prodData.category_id, prodData.product_name, prodData.brand, prodData.mrp, prodData.stock_qty, prodData.is_active ?? true, prodData.image_url || '']
    );
    return prodData;
  }

  const store = memoryStores[normType] || memoryStores.mysql;
  store.products.push(prodData);
  return prodData;
}

export async function updateProduct(productId, updates, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  const idx = store.products.findIndex(p => p.product_id === productId);
  if (idx !== -1) {
    store.products[idx] = { ...store.products[idx], ...updates };
    return store.products[idx];
  }
  return null;
}

export async function deleteProduct(productId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  store.products = store.products.filter(p => p.product_id !== productId);
  return true;
}

// ---------------------------------------------------
// CATEGORY OPERATIONS
// ---------------------------------------------------

export async function getAllCategories(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  return store.categories;
}

export async function createCategory(catData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  store.categories.push(catData);
  return catData;
}

export async function updateCategory(categoryId, updates, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  const idx = store.categories.findIndex(c => c.category_id === categoryId);
  if (idx !== -1) {
    store.categories[idx] = { ...store.categories[idx], ...updates };
    return store.categories[idx];
  }
  return null;
}

export async function deleteCategory(categoryId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  store.categories = store.categories.filter(c => c.category_id !== categoryId);
  return true;
}

// ---------------------------------------------------
// CART OPERATIONS (Includes derived grand_total & items_total)
// ---------------------------------------------------

export async function getCartByCustomerId(customerId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

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

export async function addToCart(customerId, productId, quantity = 1, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

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

export async function updateCartItemQuantity(customerId, productId, quantity, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
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

export async function removeFromCart(customerId, productId, dbType = 'mysql') {
  return await updateCartItemQuantity(customerId, productId, 0, dbType);
}

export async function clearCart(customerId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  const cart = await getCartByCustomerId(customerId, dbType);
  store.cart_item = store.cart_item.filter(ci => ci.cart_id !== cart.cart_id);
  return await getCartByCustomerId(customerId, dbType);
}

// ---------------------------------------------------
// ADDRESS OPERATIONS
// ---------------------------------------------------

export async function getAddressesByCustomerId(customerId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  return store.addresses.filter(a => a.customer_id === customerId);
}

export async function createAddress(addrData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

  if (addrData.is_default) {
    store.addresses.forEach(a => {
      if (a.customer_id === addrData.customer_id) a.is_default = false;
    });
  }

  store.addresses.push(addrData);
  return addrData;
}

export async function updateAddress(addressId, updates, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
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

export async function deleteAddress(addressId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  store.addresses = store.addresses.filter(a => a.address_id !== addressId);
  return true;
}

// ---------------------------------------------------
// ORDER & PAYMENT OPERATIONS
// ---------------------------------------------------

export async function addOrderHistoryRecord(historyData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
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

export async function getOrderHistory(orderId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  if (!store.order_history) store.order_history = [];

  return store.order_history
    .filter(h => h.order_id === orderId)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

export async function createOrder(orderPayload, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

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

export async function getAllOrders(filters = {}, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  if (!store.order_history) store.order_history = [];

  let list = store.orders.map(ord => {
    const cust = store.customers.find(c => c.customer_id === ord.customer_id);
    const addr = store.addresses.find(a => a.address_id === ord.address_id);
    const items = store.order_item.filter(oi => oi.order_id === ord.order_id).map(oi => {
      const prod = store.products.find(p => p.product_id === oi.product_id);
      return { ...oi, product_name: prod ? prod.product_name : '', brand: prod ? prod.brand : '', seller_id: prod ? prod.seller_id : '' };
    });
    const pay = store.payments.find(p => p.order_id === ord.order_id);
    const history = store.order_history
      .filter(h => h.order_id === ord.order_id)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return {
      ...ord,
      customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Customer',
      customer_email: cust ? cust.email : '',
      address: addr || null,
      payment: pay || null,
      items,
      history
    };
  });

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

export async function getOrderById(orderId, dbType = 'mysql') {
  const orders = await getAllOrders({}, dbType);
  return orders.find(o => o.order_id === orderId) || null;
}

export async function updateOrderStatus(orderId, status, performedBy = 'System', dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
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

export async function getAllPayments(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  return store.payments;
}

// ---------------------------------------------------
// REVIEWS OPERATIONS
// ---------------------------------------------------

export async function getReviewsByProductId(productId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

  return store.reviews
    .filter(r => r.product_id === productId)
    .map(r => {
      const cust = store.customers.find(c => c.customer_id === r.customer_id);
      return {
        ...r,
        customer_name: cust ? `${cust.first_name} ${cust.last_name}` : 'Verified Customer'
      };
    });
}

export async function createReview(reviewData, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

  // Verify customer has ordered this product
  const orders = await getAllOrders({ customer_id: reviewData.customer_id }, dbType);
  const hasPurchased = orders.some(o => o.items.some(i => i.product_id === reviewData.product_id));
  if (!hasPurchased) {
    throw new Error('A customer can only review products they have purchased.');
  }

  const reviewRecord = {
    review_id: `rev-${Date.now()}`,
    customer_id: reviewData.customer_id,
    product_id: reviewData.product_id,
    rating: parseInt(reviewData.rating),
    description: reviewData.description,
    review_date: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  store.reviews.unshift(reviewRecord);
  return reviewRecord;
}

export async function deleteReview(reviewId, dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  store.reviews = store.reviews.filter(r => r.review_id !== reviewId);
  return true;
}

// ---------------------------------------------------
// CUSTOMERS & SELLERS LIST & STATS
// ---------------------------------------------------

export async function getAllCustomers(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  return store.customers.map(c => ({
    ...c,
    age: calculateAge(c.date_of_birth)
  }));
}

export async function getAllSellers(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;
  return Promise.all(store.sellers.map(s => getSellerById(s.seller_id, dbType)));
}

export async function getAdminStats(dbType = 'mysql') {
  const normType = (dbType || 'mysql').toLowerCase();
  const store = memoryStores[normType] || memoryStores.mysql;

  const totalCustomers = store.customers.length;
  const totalSellers = store.sellers.length;
  const totalProducts = store.products.length;
  const totalOrders = store.orders.length;
  const pendingOrders = store.orders.filter(o => o.order_status === 'Pending').length;
  const totalRevenue = store.orders.reduce((acc, o) => acc + parseFloat(o.order_amount), 0);

  return {
    totalCustomers,
    totalSellers,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    activeDatabase: normType.toUpperCase()
  };
}
