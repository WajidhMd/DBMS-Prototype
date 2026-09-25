/**
 * E-Commerce DBMS Prototype - Application Logic
 */

// Global state variables
let currentTab = 'products';
let currentDDLEngine = 'MySQL';
let currentDDLTable = 'users';
let searchQuery = '';
let activeUsersData = [...sampleUsers];
let activeProductsData = [...sampleProducts];
let activeOrdersData = [...sampleOrders];

// Initialize login page
function initAuthPage() {
  renderDemoUsersDrawer();
  const alertEl = document.getElementById('authAlert');
  if (alertEl) alertEl.style.display = 'none';
}

// Render sample accounts list in drawer
function renderDemoUsersDrawer() {
  const container = document.getElementById('demoUsersList');
  if (!container) return;

  container.innerHTML = sampleUsers.map(user => `
    <div class="demo-user-card" onclick="quickFillCredentials('${user.username}', '${user.password}', '${user.database_preference}')">
      <div class="demo-user-info">
        <span class="demo-user-name">${escapeHTML(user.username)}</span>
        <span class="demo-user-role">${escapeHTML(user.role)}</span>
        <span class="demo-user-dept">Dept: ${escapeHTML(user.department)} | DB: ${escapeHTML(user.database_preference)}</span>
      </div>
      <span class="demo-user-action">Select</span>
    </div>
  `).join('');
}

// Autofill login credentials from drawer
function quickFillCredentials(username, password, dbPref) {
  const usernameInput = document.getElementById('usernameInput');
  const passwordInput = document.getElementById('passwordInput');
  if (usernameInput) usernameInput.value = username;
  if (passwordInput) passwordInput.value = password;

  const radio = document.querySelector(`input[name="db_engine"][value="${dbPref}"]`);
  if (radio) radio.checked = true;

  toggleDemoDrawer(false);
  showToast(`Autofilled login for ${username}`, 'info');
}

// Toggle side drawer
function toggleDemoDrawer(show) {
  const drawer = document.getElementById('demoDrawer');
  if (drawer) {
    if (show) drawer.classList.add('active');
    else drawer.classList.remove('active');
  }
}

// Password show/hide toggle
function togglePasswordVisibility() {
  const input = document.getElementById('passwordInput');
  const btn = document.getElementById('togglePasswordBtn');
  if (!input || !btn) return;

  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'Hide';
  } else {
    input.type = 'password';
    btn.textContent = 'Show';
  }
}

// Login form submit handler
function handleLogin(event) {
  event.preventDefault();

  const usernameVal = document.getElementById('usernameInput')?.value.trim();
  const passwordVal = document.getElementById('passwordInput')?.value;
  const engineVal = document.querySelector('input[name="db_engine"]:checked')?.value || 'MySQL';
  const alertEl = document.getElementById('authAlert');

  if (!usernameVal || !passwordVal) {
    if (alertEl) {
      alertEl.textContent = 'Please enter both username and password.';
      alertEl.style.display = 'flex';
    }
    return;
  }

  const foundUser = sampleUsers.find(u => u.username.toLowerCase() === usernameVal.toLowerCase() && u.password === passwordVal);

  if (!foundUser) {
    if (alertEl) {
      alertEl.innerHTML = '<span>Invalid username or password. Please try again.</span>';
      alertEl.style.display = 'flex';
    }
    return;
  }

  const sessionData = {
    user_id: foundUser.user_id,
    username: foundUser.username,
    email: foundUser.email,
    role: foundUser.role,
    department: foundUser.department,
    database_preference: foundUser.database_preference,
    connected_engine: engineVal,
    login_time: new Date().toISOString()
  };

  sessionStorage.setItem('ecom_session', JSON.stringify(sessionData));
  window.location.href = 'dashboard.html';
}

// Get logged in user session
function getActiveSession() {
  const raw = sessionStorage.getItem('ecom_session');
  if (raw) {
    try { return JSON.parse(raw); } catch (e) {}
  }
  return {
    user_id: 1,
    username: "admin_sarah",
    email: "sarah.admin@ecomstore.com",
    role: "Store Administrator",
    department: "Operations",
    database_preference: "MySQL",
    connected_engine: "MySQL"
  };
}

// Initialize dashboard page
function initDashboard() {
  const session = getActiveSession();

  const userDisplayName = document.getElementById('userDisplayName');
  const userDisplayRole = document.getElementById('userDisplayRole');
  const userAvatar = document.getElementById('userAvatar');
  const sessionEnginePill = document.getElementById('sessionEnginePill');
  const engineName = document.getElementById('engineName');

  if (userDisplayName) userDisplayName.textContent = session.username;
  if (userDisplayRole) userDisplayRole.textContent = session.role;
  if (userAvatar) userAvatar.textContent = session.username.substring(0, 2).toUpperCase();

  const engineMeta = dbmsEngineSpecs[session.connected_engine] || dbmsEngineSpecs['MySQL'];
  if (sessionEnginePill) sessionEnginePill.className = `engine-pill ${engineMeta.badgeClass}`;
  if (engineName) engineName.textContent = engineMeta.name;

  const mismatchBanner = document.getElementById('mismatchBanner');
  if (mismatchBanner) {
    if (session.connected_engine !== session.database_preference) {
      document.getElementById('mismatchConnected').textContent = session.connected_engine;
      document.getElementById('mismatchPreferred').textContent = session.database_preference;
      mismatchBanner.style.display = 'flex';
    } else {
      mismatchBanner.style.display = 'none';
    }
  }

  updateMetrics();
  switchTab('products');
}

// Update header summary metrics
function updateMetrics() {
  const totalRevenue = activeOrdersData
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const metricRevenue = document.getElementById('metricRevenue');
  if (metricRevenue) metricRevenue.textContent = `$${totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

  const metricOrders = document.getElementById('metricOrders');
  if (metricOrders) metricOrders.textContent = activeOrdersData.length;

  const metricProducts = document.getElementById('metricProducts');
  if (metricProducts) metricProducts.textContent = activeProductsData.length;

  const lowStockCount = activeProductsData.filter(p => p.stock <= 15).length;
  const metricLowStock = document.getElementById('metricLowStock');
  if (metricLowStock) metricLowStock.textContent = lowStockCount;
}

// Logout session
function handleLogout() {
  sessionStorage.removeItem('ecom_session');
  showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 300);
}

// Switch dashboard tabs
function switchTab(tabName) {
  currentTab = tabName;
  searchQuery = '';

  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';

  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeTabBtn = document.getElementById(`tab${capitalize(tabName)}`);
  if (activeTabBtn) activeTabBtn.classList.add('active');

  const addBtnText = document.getElementById('addBtnText');
  const btnAddRecord = document.getElementById('btnAddRecord');
  if (addBtnText && btnAddRecord) {
    if (tabName === 'products') {
      addBtnText.textContent = 'Add Product';
      btnAddRecord.style.display = 'flex';
    } else if (tabName === 'users') {
      addBtnText.textContent = 'Add User';
      btnAddRecord.style.display = 'flex';
    } else if (tabName === 'orders') {
      addBtnText.textContent = 'Create Order';
      btnAddRecord.style.display = 'flex';
    } else {
      btnAddRecord.style.display = 'none';
    }
  }

  renderDataView();
}

// Search input handler
function handleSearch(query) {
  searchQuery = query.trim().toLowerCase();
  renderDataView();
}

// Render active tab view
function renderDataView() {
  const container = document.getElementById('dataViewContainer');
  if (!container) return;

  if (currentTab === 'products') {
    renderProductsTable(container);
  } else if (currentTab === 'orders') {
    renderOrdersTable(container);
  } else if (currentTab === 'users') {
    renderUsersTable(container);
  } else if (currentTab === 'analytics') {
    renderAnalyticsView(container);
  }
}

// Products Table
function renderProductsTable(container) {
  let filtered = activeProductsData;
  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchQuery) ||
      p.sku.toLowerCase().includes(searchQuery) ||
      p.category.toLowerCase().includes(searchQuery) ||
      p.product_id.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No matching products found</h3>
        <p>Try adjusting your search query.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Product ID / SKU</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(p => `
            <tr>
              <td>
                <div style="font-weight: 600;">${escapeHTML(p.product_id)}</div>
                <div style="font-size: 11px; color: var(--text-dim);">${escapeHTML(p.sku)}</div>
              </td>
              <td style="font-weight: 600; color: var(--text-main);">${escapeHTML(p.name)}</td>
              <td><span class="badge badge-secondary">${escapeHTML(p.category)}</span></td>
              <td style="font-weight: 600; color: #38bdf8;">$${p.price.toFixed(2)}</td>
              <td>
                <span style="font-weight: 600; ${p.stock <= 10 ? 'color: var(--danger);' : ''}">${p.stock} units</span>
              </td>
              <td>
                <span class="badge ${getStatusBadgeClass(p.status)}">${p.status}</span>
              </td>
              <td>
                <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="deleteProduct('${p.product_id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Orders Table
function renderOrdersTable(container) {
  let filtered = activeOrdersData;
  if (searchQuery) {
    filtered = filtered.filter(o => 
      o.order_id.toLowerCase().includes(searchQuery) ||
      o.customer_name.toLowerCase().includes(searchQuery) ||
      o.status.toLowerCase().includes(searchQuery) ||
      o.payment_method.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No matching orders found</h3>
        <p>Try adjusting your search query.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Items</th>
            <th>Total Amount</th>
            <th>Payment Method</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(o => `
            <tr>
              <td style="font-weight: 600; color: var(--primary);">${escapeHTML(o.order_id)}</td>
              <td>
                <div style="font-weight: 600;">${escapeHTML(o.customer_name)}</div>
                <div style="font-size: 11px; color: var(--text-dim);">${escapeHTML(o.customer_email)}</div>
              </td>
              <td>${o.date}</td>
              <td>${o.items_count} item(s)</td>
              <td style="font-weight: 600; color: var(--success);">$${o.total_amount.toFixed(2)}</td>
              <td><span class="badge badge-secondary">${escapeHTML(o.payment_method)}</span></td>
              <td>
                <span class="badge ${getOrderStatusBadgeClass(o.status)}">${o.status}</span>
              </td>
              <td>
                <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="cycleOrderStatus('${o.order_id}')">Update Status</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Users Table
function renderUsersTable(container) {
  let filtered = activeUsersData;
  if (searchQuery) {
    filtered = filtered.filter(u => 
      u.username.toLowerCase().includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery) ||
      u.role.toLowerCase().includes(searchQuery) ||
      u.department.toLowerCase().includes(searchQuery) ||
      u.database_preference.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No matching user records found</h3>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-responsive">
      <table class="custom-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username / Email</th>
            <th>Role</th>
            <th>Department</th>
            <th>Database Preference</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(u => `
            <tr>
              <td style="font-weight: 600; color: var(--text-dim);">#${u.user_id}</td>
              <td>
                <div style="font-weight: 600; color: var(--text-main);">${escapeHTML(u.username)}</div>
                <div style="font-size: 11px; color: var(--text-muted);">${escapeHTML(u.email)}</div>
              </td>
              <td><span class="badge badge-info">${escapeHTML(u.role)}</span></td>
              <td>${escapeHTML(u.department)}</td>
              <td>
                <span class="badge ${getEngineBadgeClass(u.database_preference)}">${u.database_preference}</span>
              </td>
              <td>
                <button class="btn-secondary" style="padding: 4px 10px; font-size: 11px;" onclick="fireUser(${u.user_id})">Fire</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Analytics View
function renderAnalyticsView(container) {
  const categories = {};
  activeProductsData.forEach(p => {
    categories[p.category] = (categories[p.category] || 0) + p.stock;
  });

  const maxStock = Math.max(...Object.values(categories), 1);

  container.innerHTML = `
    <div style="padding: 20px;">
      <div class="analytics-grid">
        <div class="analytics-card">
          <div class="analytics-title">
            <span>Category Stock Distribution</span>
            <span style="font-size: 11px; color: var(--text-dim);">Real-time</span>
          </div>
          ${Object.keys(categories).map(cat => {
            const val = categories[cat];
            const pct = Math.round((val / maxStock) * 100);
            return `
              <div class="bar-chart-item">
                <div class="bar-chart-label">
                  <span style="font-weight: 500;">${cat}</span>
                  <span style="color: var(--text-muted);">${val} in stock</span>
                </div>
                <div class="bar-chart-track">
                  <div class="bar-chart-fill" style="width: ${pct}%;"></div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="analytics-card">
          <div class="analytics-title">
            <span>Supported Database Engines</span>
            <span style="font-size: 11px; color: var(--success);">DBMS Specs</span>
          </div>
          <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px;">
            The prototype schema is normalized to 3NF standard for relational SQL targets and validated for document collections on MongoDB.
          </p>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="font-weight: 600; color: #38bdf8;">MySQL 8.0</div>
              <div style="font-size: 11px; color: var(--text-muted);">InnoDB storage engine with indexed foreign key relationships.</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="font-weight: 600; color: #818cf8;">PostgreSQL 16</div>
              <div style="font-size: 11px; color: var(--text-muted);">MVCC concurrency control and JSONB document support.</div>
            </div>
            <div style="padding: 10px; background: rgba(255,255,255,0.02); border-radius: 6px; border: 1px solid var(--border-color);">
              <div style="font-weight: 600; color: #34d399;">MongoDB 7.0</div>
              <div style="font-size: 11px; color: var(--text-muted);">$jsonSchema document validation and index constraints.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Modal handlers
function openDDLModal() {
  const modal = document.getElementById('ddlModal');
  if (modal) modal.classList.add('active');
  updateDDLView();
}

function closeDDLModal() {
  const modal = document.getElementById('ddlModal');
  if (modal) modal.classList.remove('active');
}

function switchDDLEngine(engine) {
  currentDDLEngine = engine;
  document.querySelectorAll('.ddl-tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`ddlTab${engine}`);
  if (activeBtn) activeBtn.classList.add('active');

  updateDDLView();
}

function updateDDLView() {
  const tableSelect = document.getElementById('ddlTableSelect');
  if (tableSelect) currentDDLTable = tableSelect.value;

  const codeEl = document.getElementById('ddlCodeText');
  if (!codeEl) return;

  const ddlObject = schemaDDL[currentDDLTable];
  if (ddlObject && ddlObject[currentDDLEngine]) {
    codeEl.textContent = ddlObject[currentDDLEngine];
  } else {
    codeEl.textContent = `-- DDL definition not found for ${currentDDLTable} on ${currentDDLEngine}`;
  }
}

function copyDDLCode() {
  const codeEl = document.getElementById('ddlCodeText');
  if (codeEl && codeEl.textContent) {
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
      showToast('Copied DDL code to clipboard', 'success');
    }).catch(() => {
      showToast('Copied to clipboard', 'success');
    });
  }
}

// Add item modal
function openAddModal() {
  const modal = document.getElementById('addModal');
  const title = document.getElementById('addModalTitle');
  const content = document.getElementById('addModalFormContent');
  if (!modal || !content) return;

  if (currentTab === 'products') {
    title.textContent = 'Add New Product';
    content.innerHTML = `
      <form onsubmit="saveNewProduct(event)">
        <div class="form-group">
          <label class="form-label">Product Name</label>
          <input type="text" id="newProdName" class="form-input" required placeholder="e.g. Wireless Mouse">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Category</label>
            <input type="text" id="newProdCat" class="form-input" required placeholder="e.g. Accessories">
          </div>
          <div class="form-group">
            <label class="form-label">SKU</label>
            <input type="text" id="newProdSKU" class="form-input" required placeholder="SKU-ACC-001">
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Price ($)</label>
            <input type="number" step="0.01" id="newProdPrice" class="form-input" required placeholder="29.99">
          </div>
          <div class="form-group">
            <label class="form-label">Stock Quantity</label>
            <input type="number" id="newProdStock" class="form-input" required placeholder="50">
          </div>
        </div>
        <button type="submit" class="btn-primary" style="margin-top: 10px;">Save Product</button>
      </form>
    `;
  } else if (currentTab === 'users') {
    title.textContent = 'Add New User';
    content.innerHTML = `
      <form onsubmit="saveNewUser(event)">
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" id="newUserName" class="form-input" required placeholder="e.g. john_doe">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" id="newUserEmail" class="form-input" required placeholder="john@ecomstore.com">
        </div>
        <div class="form-group">
          <label class="form-label">Role</label>
          <select id="newUserRole" class="form-input">
            <option value="Store Administrator">Store Administrator</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Sales & Revenue Manager">Sales & Revenue Manager</option>
            <option value="Order Fulfillment Lead">Order Fulfillment Lead</option>
            <option value="Customer Support Lead">Customer Support Lead</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Department</label>
          <input type="text" id="newUserDept" class="form-input" required placeholder="Operations">
        </div>
        <div class="form-group">
          <label class="form-label">Database Preference</label>
          <select id="newUserEngine" class="form-input">
            <option value="MySQL">MySQL</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MongoDB">MongoDB</option>
          </select>
        </div>
        <button type="submit" class="btn-primary" style="margin-top: 10px;">Save User</button>
      </form>
    `;
  } else if (currentTab === 'orders') {
    title.textContent = 'Create New Order';
    content.innerHTML = `
      <form onsubmit="saveNewOrder(event)">
        <div class="form-group">
          <label class="form-label">Customer Name</label>
          <input type="text" id="newOrdCust" class="form-input" required placeholder="e.g. John Doe">
        </div>
        <div class="form-group">
          <label class="form-label">Customer Email</label>
          <input type="email" id="newOrdEmail" class="form-input" required placeholder="john@gmail.com">
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div class="form-group">
            <label class="form-label">Total Amount ($)</label>
            <input type="number" step="0.01" id="newOrdAmount" class="form-input" required placeholder="99.99">
          </div>
          <div class="form-group">
            <label class="form-label">Payment Method</label>
            <select id="newOrdPay" class="form-input">
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Apple Pay">Apple Pay</option>
            </select>
          </div>
        </div>
        <button type="submit" class="btn-primary" style="margin-top: 10px;">Create Order</button>
      </form>
    `;
  }

  modal.classList.add('active');
}

function closeAddModal() {
  const modal = document.getElementById('addModal');
  if (modal) modal.classList.remove('active');
}

function saveNewProduct(e) {
  e.preventDefault();
  const name = document.getElementById('newProdName').value;
  const category = document.getElementById('newProdCat').value;
  const sku = document.getElementById('newProdSKU').value;
  const price = parseFloat(document.getElementById('newProdPrice').value) || 0;
  const stock = parseInt(document.getElementById('newProdStock').value) || 0;

  const newProd = {
    product_id: `PRD-${Math.floor(100 + Math.random() * 900)}`,
    sku,
    name,
    category,
    price,
    stock,
    status: stock === 0 ? 'Out of Stock' : (stock <= 15 ? 'Low Stock' : 'In Stock')
  };

  activeProductsData.unshift(newProd);
  closeAddModal();
  updateMetrics();
  renderDataView();
  showToast(`Added product "${name}"`, 'success');
}

function saveNewUser(e) {
  e.preventDefault();
  const username = document.getElementById('newUserName').value;
  const email = document.getElementById('newUserEmail').value;
  const role = document.getElementById('newUserRole').value;
  const department = document.getElementById('newUserDept').value;
  const database_preference = document.getElementById('newUserEngine').value;

  const newUser = {
    user_id: activeUsersData.length + 1,
    username,
    email,
    password: "password123",
    role,
    department,
    database_preference
  };

  activeUsersData.unshift(newUser);
  closeAddModal();
  renderDataView();
  showToast(`Added user "${username}"`, 'success');
}

function saveNewOrder(e) {
  e.preventDefault();
  const customer_name = document.getElementById('newOrdCust').value;
  const customer_email = document.getElementById('newOrdEmail').value;
  const total_amount = parseFloat(document.getElementById('newOrdAmount').value) || 0;
  const payment_method = document.getElementById('newOrdPay').value;

  const newOrd = {
    order_id: `ORD-${Math.floor(9000 + Math.random() * 99)}`,
    customer_name,
    customer_email,
    date: new Date().toISOString().split('T')[0],
    items_count: 1,
    total_amount,
    payment_method,
    status: 'Processing'
  };

  activeOrdersData.unshift(newOrd);
  closeAddModal();
  updateMetrics();
  renderDataView();
  showToast(`Created order ${newOrd.order_id}`, 'success');
}

function deleteProduct(prodId) {
  activeProductsData = activeProductsData.filter(p => p.product_id !== prodId);
  updateMetrics();
  renderDataView();
  showToast(`Deleted product ${prodId}`, 'warning');
}

function fireUser(userId) {
  const user = activeUsersData.find(u => u.user_id === userId);
  const username = user ? user.username : `#${userId}`;
  activeUsersData = activeUsersData.filter(u => u.user_id !== userId);
  renderDataView();
  showToast(`Fired user ${username}`, 'warning');
}

function cycleOrderStatus(orderId) {
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const order = activeOrdersData.find(o => o.order_id === orderId);
  if (order) {
    const nextIdx = (statuses.indexOf(order.status) + 1) % statuses.length;
    order.status = statuses[nextIdx];
    updateMetrics();
    renderDataView();
    showToast(`Order ${orderId} updated to ${order.status}`, 'info');
  }
}

function exportActiveDataset() {
  let dataset = activeProductsData;
  let filename = 'products.json';

  if (currentTab === 'orders') {
    dataset = activeOrdersData;
    filename = 'orders.json';
  } else if (currentTab === 'users') {
    dataset = activeUsersData;
    filename = 'users.json';
  }

  const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`Exported ${filename}`, 'success');
}

// Helpers & Toast
function getStatusBadgeClass(status) {
  if (status === 'In Stock') return 'badge-success';
  if (status === 'Low Stock') return 'badge-warning';
  return 'badge-danger';
}

function getOrderStatusBadgeClass(status) {
  if (status === 'Delivered') return 'badge-success';
  if (status === 'Processing' || status === 'Shipped') return 'badge-info';
  if (status === 'Pending') return 'badge-warning';
  return 'badge-danger';
}

function getEngineBadgeClass(engine) {
  if (engine === 'MySQL') return 'badge-mysql';
  if (engine === 'PostgreSQL') return 'badge-postgres';
  return 'badge-mongo';
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHTML(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>${escapeHTML(message)}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.2s ease';
    setTimeout(() => toast.remove(), 200);
  }, 2500);
}
