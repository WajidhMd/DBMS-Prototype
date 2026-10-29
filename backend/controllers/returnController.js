import {
  createReturnRequest as submitReturn,
  getReturnRequests,
  getReturnById as fetchReturn,
  updateReturnStatus as modifyReturnStatus
} from '../services/dbAdapter.js';

// CUSTOMER: Submit a return request
export async function createReturn(req, res) {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can submit return requests.' });
    }

    const { order_id, items, reason, comments } = req.body;
    if (!order_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Order ID and at least one item are required.' });
    }

    const validReasons = [
      'Damaged product',
      'Wrong product delivered',
      'Defective product',
      'Product does not match the description',
      'Other'
    ];
    if (reason && !validReasons.includes(reason)) {
      return res.status(400).json({ error: `Invalid return reason. Valid reasons: ${validReasons.join(', ')}` });
    }

    const result = await submitReturn({
      customer_id: req.user.ref_id,
      order_id,
      items,
      reason: reason || 'Other',
      comments: comments || ''
    }, req.dbType);

    return res.status(201).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to create return request.' });
  }
}

// GET returns based on user role
export async function getReturns(req, res) {
  try {
    const filters = {};

    if (req.user.role === 'CUSTOMER') {
      filters.customer_id = req.user.ref_id;
    } else if (req.user.role === 'SELLER') {
      filters.seller_id = req.user.ref_id;
    }
    // EMPLOYEE and ADMIN see all

    const returns = await getReturnRequests(filters, req.dbType);
    return res.json(returns);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch return requests.' });
  }
}

// GET single return by ID
export async function getReturnById(req, res) {
  try {
    const returnReq = await fetchReturn(req.params.id, req.dbType);
    if (!returnReq) return res.status(404).json({ error: 'Return request not found.' });

    // Authorization
    if (req.user.role === 'CUSTOMER' && returnReq.customer_id !== req.user.ref_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    return res.json(returnReq);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch return details.' });
  }
}

// EMPLOYEE: Approve a return
export async function approveReturn(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only employees can approve return requests.' });
    }

    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_APPROVED', 
      req.user.email, 
      {}, 
      req.dbType
    );

    return res.json({ message: 'Return request approved.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to approve return.' });
  }
}

// EMPLOYEE: Reject a return
export async function rejectReturn(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only employees can reject return requests.' });
    }

    const { rejection_reason } = req.body;
    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_REJECTED', 
      req.user.email, 
      { rejection_reason: rejection_reason || 'Does not meet return policy.' },
      req.dbType
    );

    return res.json({ message: 'Return request rejected.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to reject return.' });
  }
}

// CUSTOMER: Ship the return
export async function shipReturn(req, res) {
  try {
    if (req.user.role !== 'CUSTOMER') {
      return res.status(403).json({ error: 'Only customers can initiate return shipments.' });
    }

    // Verify this return belongs to the customer
    const returnReq = await fetchReturn(req.params.id, req.dbType);
    if (!returnReq || returnReq.customer_id !== req.user.ref_id) {
      return res.status(403).json({ error: 'Access denied.' });
    }

    const { courier_name, tracking_number } = req.body;
    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_SHIPPED', 
      req.user.email,
      { courier_name, tracking_number },
      req.dbType
    );

    return res.json({ message: 'Return shipment initiated.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to ship return.' });
  }
}

// EMPLOYEE: Mark return in transit
export async function markReturnInTransit(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only employees can update transit status.' });
    }

    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_IN_TRANSIT', 
      req.user.email,
      {},
      req.dbType
    );

    return res.json({ message: 'Return marked as in transit.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to update status.' });
  }
}

// SELLER: Confirm receipt of returned product
export async function confirmReturnReceived(req, res) {
  try {
    if (req.user.role !== 'SELLER' && req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only sellers or employees can confirm return receipt.' });
    }

    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_RECEIVED', 
      req.user.email,
      {},
      req.dbType
    );

    return res.json({ message: 'Return received confirmed.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to confirm receipt.' });
  }
}

// EMPLOYEE: Complete the return
export async function completeReturn(req, res) {
  try {
    if (req.user.role !== 'EMPLOYEE' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only employees can finalize returns.' });
    }

    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_COMPLETED', 
      req.user.email,
      {},
      req.dbType
    );

    return res.json({ message: 'Return completed and refund initiated.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to complete return.' });
  }
}

// CUSTOMER: Cancel a return
export async function cancelReturn(req, res) {
  try {
    if (req.user.role !== 'CUSTOMER' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Only customers can cancel their own return requests.' });
    }

    if (req.user.role === 'CUSTOMER') {
      const returnReq = await fetchReturn(req.params.id, req.dbType);
      if (!returnReq || returnReq.customer_id !== req.user.ref_id) {
        return res.status(403).json({ error: 'Access denied.' });
      }
    }

    const updated = await modifyReturnStatus(
      req.params.id, 
      'RETURN_CANCELLED', 
      req.user.email,
      {},
      req.dbType
    );

    return res.json({ message: 'Return request cancelled.', return: updated });
  } catch (err) {
    return res.status(400).json({ error: err.message || 'Failed to cancel return.' });
  }
}
