import {
  getAddressesByCustomerId,
  createAddress as insertAddress,
  updateAddress as modifyAddress,
  deleteAddress as removeAddress
} from '../services/dbAdapter.js';

export async function getAddresses(req, res) {
  try {
    const customerId = req.user.ref_id;
    const addresses = await getAddressesByCustomerId(customerId, req.dbType);
    return res.json(addresses);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch customer addresses.' });
  }
}

export async function createAddress(req, res) {
  try {
    const customerId = req.user.ref_id;
    const { street, apartment_no, city, state, pincode, is_default } = req.body;

    if (!street || !city || !state || !pincode) {
      return res.status(400).json({ error: 'Street, city, state, and pincode are required.' });
    }

    const addrData = {
      address_id: `addr-${Date.now()}`,
      customer_id: customerId,
      street,
      apartment_no: apartment_no || '',
      city,
      state,
      pincode,
      is_default: Boolean(is_default)
    };

    const created = await insertAddress(addrData, req.dbType);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create address.' });
  }
}

export async function updateAddress(req, res) {
  try {
    const updated = await modifyAddress(req.params.id, req.body, req.dbType);
    if (!updated) return res.status(404).json({ error: 'Address not found.' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update address.' });
  }
}

export async function deleteAddress(req, res) {
  try {
    await removeAddress(req.params.id, req.dbType);
    return res.json({ message: 'Address deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete address.' });
  }
}
