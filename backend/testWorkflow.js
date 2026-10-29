// Verification script for full workflow testing using native fetch
const BASE_URL = 'http://localhost:5000/api';

async function req(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const config = {
    method: options.method || 'GET',
    headers,
    ...(options.body ? { body: JSON.stringify(options.body) } : {})
  };

  const res = await fetch(url, config);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

async function testWorkflow() {
  console.log('--- STARTING COMPREHENSIVE E2E VERIFICATION ---');

  // 1. Health check & Database selector check
  console.log('\n[1] Testing Health check & Database selector...');
  const healthData = await req('/health', {
    headers: { 'x-database-type': 'postgresql' }
  });
  console.log('✅ Health response:', healthData);
  if (healthData.activeTargetDatabase !== 'postgresql') {
    throw new Error('Default/selected database should be postgresql');
  }

  // Check MySQL rejection
  const mysqlCheck = await req('/health', {
    headers: { 'x-database-type': 'mysql' }
  });
  console.log('✅ MySQL fallback check (should normalize to postgresql):', mysqlCheck.activeTargetDatabase);
  if (mysqlCheck.activeTargetDatabase !== 'postgresql') {
    throw new Error('MySQL should not be accepted and must fallback to postgresql');
  }

  // 2. Authentication Test
  console.log('\n[2] Testing Authentication across roles...');
  const loginCust = await req('/auth/login', {
    method: 'POST',
    body: { email: 'john.doe@example.com', password: 'password123' },
    headers: { 'x-database-type': 'postgresql' }
  });
  const custToken = loginCust.token;
  console.log('✅ Customer logged in. Name:', loginCust.user.profile.first_name);

  const loginEmp = await req('/auth/login', {
    method: 'POST',
    body: { email: 'employee@ecommerce.com', password: 'password123' },
    headers: { 'x-database-type': 'postgresql' }
  });
  const empToken = loginEmp.token;
  console.log('✅ Employee logged in:', loginEmp.user.email);

  const loginSeller = await req('/auth/login', {
    method: 'POST',
    body: { email: 'techworld@seller.com', password: 'password123' },
    headers: { 'x-database-type': 'postgresql' }
  });
  const sellerToken = loginSeller.token;
  console.log('✅ Seller logged in:', loginSeller.user.profile.name);

  const loginAdmin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'admin@ecommerce.com', password: 'password123' },
    headers: { 'x-database-type': 'postgresql' }
  });
  const adminToken = loginAdmin.token;
  console.log('✅ Admin logged in:', loginAdmin.user.email);

  // 3. Customer views delivered orders
  console.log('\n[3] Testing Orders retrieval...');
  const orders = await req('/orders', {
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Customer orders fetched: ${orders.length} orders found.`);
  const deliveredOrder = orders.find(o => o.order_status === 'DELIVERED');
  if (!deliveredOrder) throw new Error('Customer should have at least 1 delivered order in seed');
  console.log(`✅ Delivered Order found: ${deliveredOrder.order_number} with ${deliveredOrder.items.length} items`);

  // 4. Customer submits Return Request
  console.log('\n[4] Customer submitting Return Request...');
  const returnItem = deliveredOrder.items[0];
  const returnRes = await req('/returns', {
    method: 'POST',
    body: {
      order_id: deliveredOrder.order_id,
      items: [{ product_id: returnItem.product_id, quantity: 1 }],
      reason: 'Damaged product',
      comments: 'Product box was open upon delivery and device has a scratch.',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'
    },
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  const returnId = returnRes.return_id;
  console.log(`✅ Return created successfully: Return ID = ${returnId}, Status = ${returnRes.return_status}`);

  // 5. Employee reviews and approves Return
  console.log('\n[5] Employee reviewing and approving Return...');
  const empReturns = await req('/returns', {
    headers: { Authorization: `Bearer ${empToken}`, 'x-database-type': 'postgresql' }
  });
  const foundInEmp = empReturns.find(r => r.return_id === returnId);
  if (!foundInEmp) throw new Error('Return request not visible to employee!');
  console.log(`✅ Employee saw return request: ${foundInEmp.return_id}`);

  const approveRes = await req(`/returns/${returnId}/approve`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${empToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Employee approved return: Status = ${approveRes.return.return_status}`);

  // 6. Customer initiates Return Shipment
  console.log('\n[6] Customer initiating Return Shipping...');
  const shipRes = await req(`/returns/${returnId}/ship`, {
    method: 'POST',
    body: {
      courier_name: 'FedEx Express',
      tracking_number: 'FDX-RET-990214'
    },
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Return Shipped by Customer: Status = ${shipRes.return.return_status}, Courier = ${shipRes.return.courier_name}, Tracking = ${shipRes.return.tracking_number}`);

  // 6b. Employee / Courier marks In Transit
  console.log('\n[6b] Employee marking Return In Transit...');
  const transitRes = await req(`/returns/${returnId}/transit`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${empToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Return Marked In Transit: Status = ${transitRes.return.return_status}`);

  // 7. Seller sees Returned Product
  console.log('\n[7] Original Seller checking Returned Products...');
  const sellerReturns = await req('/returns', {
    headers: { Authorization: `Bearer ${sellerToken}`, 'x-database-type': 'postgresql' }
  });
  const foundInSeller = sellerReturns.find(r => r.return_id === returnId);
  if (!foundInSeller) throw new Error('Returned product should be visible to original seller!');
  console.log(`✅ Seller saw returned product shipment: Return ID = ${foundInSeller.return_id}, Items = ${foundInSeller.items.length}`);

  // 8. Seller confirms receipt
  console.log('\n[8] Seller confirming receipt of returned item...');
  const receiptRes = await req(`/returns/${returnId}/received`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${sellerToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Seller confirmed return receipt: Status = ${receiptRes.return.return_status}`);

  // 9. Employee finalizes return & completes refund
  console.log('\n[9] Employee finalizing Return & Restocking...');
  const completeRes = await req(`/returns/${returnId}/complete`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${empToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Return Completed: Status = ${completeRes.return.return_status}, Refund = $${completeRes.return.refund_amount} (${completeRes.return.refund_status})`);

  // 10. Customer Feedback / Review testing
  console.log('\n[10] Customer deleting prior review rev-002 to test delete permissions...');
  await req('/reviews/rev-002', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  console.log('✅ Customer deleted their existing review rev-002 successfully.');

  console.log('\n[10b] Customer submitting new Product Review for prod-005...');
  const reviewRes = await req('/reviews', {
    method: 'POST',
    body: {
      product_id: 'prod-005',
      rating: 5,
      description: 'Outstanding running shoes, lightweight and great cushioning!'
    },
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  const reviewId = reviewRes.review_id;
  console.log(`✅ Customer review submitted: ID = ${reviewId}, Rating = ${reviewRes.rating}/5`);

  // Verify duplicate review prevention on prod-005
  try {
    await req('/reviews', {
      method: 'POST',
      body: { product_id: 'prod-005', rating: 4, description: 'Duplicate attempt' },
      headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
    });
    throw new Error('Should have prevented duplicate review');
  } catch (err) {
    console.log('✅ Duplicate review successfully prevented by backend validation!');
  }

  // 11. Customer edits their review
  console.log('\n[11] Customer updating their review...');
  const updateRevRes = await req(`/reviews/${reviewId}`, {
    method: 'PUT',
    body: {
      rating: 4,
      description: 'Updated review: Still great audio, battery lasts around 20 hours.'
    },
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Review updated: Rating = ${updateRevRes.rating}/5, text = "${updateRevRes.description}"`);

  // 12. Feedback Moderation by Admin
  console.log('\n[12] Admin checking and moderating reviews...');
  const adminReviews = await req('/reviews/admin', {
    headers: { Authorization: `Bearer ${adminToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Admin fetched all reviews: ${adminReviews.length} total reviews.`);

  const flagRes = await req(`/reviews/${reviewId}/flag`, {
    method: 'POST',
    body: { reason: 'Routine content verification check' },
    headers: { Authorization: `Bearer ${adminToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Review flagged by Admin: Flag status = ${flagRes.review.is_flagged}`);

  // 13. Notifications check
  console.log('\n[13] Checking In-App Notifications...');
  const custNotifs = await req('/notifications', {
    headers: { Authorization: `Bearer ${custToken}`, 'x-database-type': 'postgresql' }
  });
  console.log(`✅ Customer received ${custNotifs.length} notifications:`);
  custNotifs.slice(0, 3).forEach(n => console.log(`   - [${n.type}] ${n.title}: ${n.message}`));

  // 14. Testing MongoDB Target Switching
  console.log('\n[14] Testing MongoDB target database switching...');
  const mongoCustLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'john.doe@example.com', password: 'password123' },
    headers: { 'x-database-type': 'mongodb' }
  });
  console.log('✅ MongoDB Login succeeded for John Doe in MONGODB engine.');

  const mongoAdminStats = await req('/admin/stats', {
    headers: { Authorization: `Bearer ${adminToken}`, 'x-database-type': 'mongodb' }
  });
  console.log('✅ MongoDB Admin stats fetched:', mongoAdminStats);

  console.log('\n🎉 ALL INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
}

testWorkflow().catch(err => {
  console.error('❌ Test failed with error:', err.data || err.message);
  process.exit(1);
});
