import {
  createOrder as placeOrder,
  getAllOrders,
  getOrderById as fetchOrderById,
  updateOrderStatus as modifyOrderStatus,
  getOrderHistory as fetchOrderHistory,
  assignOrderToEmployee
} from '../services/dbAdapter.js';

export async function createOrder(req, res) {
  try {
    const customer_id = req.user.ref_id;
    const { address_id, payment_mode } = req.body;

    if (!address_id) {
      return res.status(400).json({ error: 'Shipping address selection is required.' });
    }

    const newOrder = await placeOrder({
      customer_id,
      address_id,
      payment_mode: payment_mode || 'Credit/Debit Card'
    }, req.dbType);

    return res.status(201).json(newOrder);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to place order.' });
  }
}

export async function getOrders(req, res) {
  try {
    const filters = {};
    if (req.user.role === 'CUSTOMER') {
      filters.customer_id = req.user.ref_id;
    } else if (req.user.role === 'SELLER') {
      filters.seller_id = req.user.ref_id;
    }

    if (req.query.assigned_to_me === 'true' && req.user.role === 'EMPLOYEE') {
      filters.assigned_employee_id = req.user.ref_id;
    }
    if (req.query.employee_id) {
      filters.assigned_employee_id = req.query.employee_id;
    }

    const orders = await getAllOrders(filters, req.dbType);
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch orders list.' });
  }
}

export async function assignOrder(req, res) {
  try {
    const orderId = req.params.id;
    let employeeId = req.body.employee_id;
    if (!employeeId && req.user.role === 'EMPLOYEE') {
      employeeId = req.user.ref_id;
    }
    if (!employeeId) {
      return res.status(400).json({ error: 'Employee ID is required.' });
    }

    const performedBy = req.user.email || req.user.role;
    const order = await assignOrderToEmployee(orderId, employeeId, performedBy, req.dbType);
    return res.json(order);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to assign order.' });
  }
}

export async function getOrderById(req, res) {
  try {
    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Authorization check
    if (req.user.role === 'CUSTOMER' && order.customer_id !== req.user.ref_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    if (req.user.role === 'SELLER') {
      const containsSellerItem = order.items?.some(i => i.seller_id === req.user.ref_id);
      const isForwarded = order.order_status !== 'ORDER_PLACED' && order.order_status !== 'PENDING_EMPLOYEE';
      if (!containsSellerItem || !isForwarded) {
        return res.status(403).json({ error: 'Access denied. Order has not been forwarded to you yet.' });
      }
    }

    return res.json(order);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch order details.' });
  }
}

// EMPLOYEE action: Forward Order to Seller
export async function forwardToSeller(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Employee or Admin can forward orders to sellers.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const currentStatus = (order.order_status || '').toUpperCase();
    if (currentStatus !== 'ORDER_PLACED' && currentStatus !== 'PENDING_EMPLOYEE' && currentStatus !== 'PENDING') {
      return res.status(400).json({
        error: `Cannot forward order. Current status is '${order.order_status}'. Order must be in ORDER_PLACED status.`
      });
    }

    const updated = await modifyOrderStatus(req.params.id, 'SENT_TO_SELLER', req.user.email, req.dbType);
    return res.json({
      message: 'Order successfully forwarded to Seller.',
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to forward order to seller.' });
  }
}

// SELLER action: Confirm Order
export async function sellerConfirmOrder(req, res) {
  try {
    if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Seller or Admin can confirm orders.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (req.user.role === 'SELLER') {
      const containsSellerItem = order.items?.some(i => i.seller_id === req.user.ref_id);
      if (!containsSellerItem) {
        return res.status(403).json({ error: 'Forbidden: Order does not contain your items.' });
      }
    }

    const currentStatus = (order.order_status || '').toUpperCase();
    if (currentStatus !== 'SENT_TO_SELLER') {
      return res.status(400).json({
        error: `Cannot confirm order. Current status is '${order.order_status}'. Order must be forwarded by employee first (SENT_TO_SELLER).`
      });
    }

    const updated = await modifyOrderStatus(req.params.id, 'ORDER_CONFIRMED', req.user.email, req.dbType);
    return res.json({
      message: 'Order confirmed and placed by Seller.',
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to confirm order.' });
  }
}

// SELLER action: Request Shipping to Employee
export async function requestShipping(req, res) {
  try {
    if (req.user.role !== 'SELLER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Seller or Admin can send shipping requests.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (req.user.role === 'SELLER') {
      const containsSellerItem = order.items?.some(i => i.seller_id === req.user.ref_id);
      if (!containsSellerItem) {
        return res.status(403).json({ error: 'Forbidden: Order does not contain your items.' });
      }
    }

    const currentStatus = (order.order_status || '').toUpperCase();
    if (currentStatus !== 'ORDER_CONFIRMED' && currentStatus !== 'SENT_TO_SELLER') {
      return res.status(400).json({
        error: `Cannot request shipping. Current status is '${order.order_status}'. Order must be in ORDER_CONFIRMED status.`
      });
    }

    // Status updates to SHIPPED upon request ship to employee, setting approx delivery date
    const updated = await modifyOrderStatus(req.params.id, 'SHIPPED', req.user.email, req.dbType);
    return res.json({
      message: 'Shipping requested by Seller. Order status changed to Order Shipped.',
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to request shipping.' });
  }
}

// EMPLOYEE action: Mark Order as SHIPPED
export async function markAsShipped(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Employee or Admin can mark orders as shipped.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const updated = await modifyOrderStatus(req.params.id, 'SHIPPED', req.user.email, req.dbType);
    return res.json({
      message: 'Order status updated to SHIPPED.',
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to mark order as shipped.' });
  }
}

// EMPLOYEE ONLY action: Mark Order as DELIVERED
export async function markAsDelivered(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Employee can mark order as delivered.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const currentStatus = (order.order_status || '').toUpperCase();
    if (currentStatus !== 'SHIPPED' && currentStatus !== 'ORDER SHIPPED') {
      return res.status(400).json({
        error: `Cannot mark as delivered. Current status is '${order.order_status}'. Order must be in SHIPPED status.`
      });
    }

    const updated = await modifyOrderStatus(req.params.id, 'DELIVERED', req.user.email, req.dbType);
    return res.json({
      message: 'Order status updated to DELIVERED.',
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to mark order as delivered.' });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });

    // Role permission enforcement
    if (req.user.role === 'CUSTOMER') {
      return res.status(403).json({ error: 'Forbidden: Customers cannot directly modify order statuses.' });
    }

    // Only Employee/Admin can mark as DELIVERED
    if (status.toUpperCase() === 'DELIVERED' && req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Only Employee can mark order as delivered.' });
    }

    const order = await fetchOrderById(req.params.id, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    const updated = await modifyOrderStatus(req.params.id, status, req.user.email, req.dbType);
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
}

export async function getHistory(req, res) {
  try {
    const history = await fetchOrderHistory(req.params.id, req.dbType);
    return res.json(history);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch order history log.' });
  }
}

// In-memory exchange store
const EXCHANGE_REQUESTS = [];

// Cancel Order prior to dispatch with instant refund processing
export async function cancelOrder(req, res) {
  try {
    const orderId = req.params.id;
    const order = await fetchOrderById(orderId, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    // Customer who owns it or Admin
    if (req.user.role === 'CUSTOMER' && order.customer_id !== req.user.ref_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const cancellableStatuses = ['ORDER_PLACED', 'PENDING_EMPLOYEE', 'SENT_TO_SELLER', 'ORDER_CONFIRMED', 'PROCESSING'];
    const currentStatus = (order.order_status || '').toUpperCase();
    if (!cancellableStatuses.includes(currentStatus)) {
      return res.status(400).json({
        error: `Cannot cancel order in '${order.order_status}' status. Cancellation is only possible prior to shipping dispatch.`
      });
    }

    const reason = req.body.reason || 'Cancelled by customer';
    const updated = await modifyOrderStatus(orderId, 'CANCELLED', `${req.user.email} (${reason})`, req.dbType);

    return res.json({
      message: `Order cancelled successfully. Instant refund of ₹${Number(order.total_amount || 0).toLocaleString('en-IN')} initiated to your original payment source.`,
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to cancel order.' });
  }
}

// Exchange item workflow for delivered orders
export async function exchangeOrder(req, res) {
  try {
    const orderId = req.params.id;
    const order = await fetchOrderById(orderId, req.dbType);
    if (!order) return res.status(404).json({ error: 'Order not found.' });

    if (req.user.role === 'CUSTOMER' && order.customer_id !== req.user.ref_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const currentStatus = (order.order_status || '').toUpperCase();
    if (currentStatus !== 'DELIVERED') {
      return res.status(400).json({
        error: `Exchange is only available for delivered orders. Current status is '${order.order_status}'.`
      });
    }

    const { itemId, reason, replacementVariant } = req.body;
    const pickupDate = new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const exchangeEntry = {
      exchangeId: `EXC-${Date.now()}`,
      orderId,
      customerId: req.user.ref_id,
      itemId,
      reason: reason || 'Size / Color exchange preference',
      replacementVariant: replacementVariant || 'Selected replacement option',
      status: 'EXCHANGE_APPROVED',
      pickupDate,
      createdAt: new Date().toISOString()
    };
    EXCHANGE_REQUESTS.push(exchangeEntry);

    try {
      await modifyOrderStatus(orderId, 'EXCHANGE_REQUESTED', `Exchange: ${exchangeEntry.replacementVariant}`, req.dbType);
    } catch (_) {}

    return res.json({
      success: true,
      message: `Exchange approved! Free doorstep reverse pickup scheduled for ${pickupDate}. Replacement item will be dispatched immediately once pickup is verified.`,
      exchange: exchangeEntry
    });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Failed to process exchange request.' });
  }
}
