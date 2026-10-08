import {
  getAllProducts,
  getProductById as fetchProductById,
  createProduct as insertProduct,
  updateProduct as modifyProduct,
  deleteProduct as removeProduct
} from '../services/dbAdapter.js';

export async function getProducts(req, res) {
  try {
    const products = await getAllProducts(req.query, req.dbType);
    return res.json(products);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch products list.' });
  }
}

export async function getProductById(req, res) {
  try {
    const product = await fetchProductById(req.params.id, req.dbType);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch product details.' });
  }
}

export async function createProduct(req, res) {
  try {
    const { product_name, brand, mrp, stock_qty, category_id, is_active, image_url } = req.body;
    let seller_id = req.user.ref_id;

    if (req.user.role === 'ADMIN' && req.body.seller_id) {
      seller_id = req.body.seller_id;
    }

    if (!product_name || !brand || mrp === undefined || !category_id || !seller_id) {
      return res.status(400).json({ error: 'Missing required product fields.' });
    }

    const newProd = {
      product_id: `prod-${Date.now()}`,
      seller_id,
      category_id,
      product_name,
      brand,
      mrp: parseFloat(mrp),
      stock_qty: parseInt(stock_qty || 0),
      is_active: is_active ?? true,
      image_url: image_url || ''
    };

    const created = await insertProduct(newProd, req.dbType);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create product.' });
  }
}

export async function updateProduct(req, res) {
  try {
    const updated = await modifyProduct(req.params.id, req.body, req.dbType);
    if (!updated) return res.status(404).json({ error: 'Product not found for update.' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update product.' });
  }
}

export async function deleteProduct(req, res) {
  try {
    await removeProduct(req.params.id, req.dbType);
    return res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
}
