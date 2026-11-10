import {
  getAllProducts,
  getProductById as fetchProductById,
  createProduct as insertProduct,
  updateProduct as modifyProduct,
  deleteProduct as removeProduct
} from '../services/dbAdapter.js';

// In-memory Q&A Store initialized with realistic sample data
const QA_DATABASE = {
  'prod-001': [
    {
      id: 'qa-1',
      question: 'Does this headphone support Active Noise Cancellation (ANC)?',
      asked_by: 'Rahul K.',
      date: '2026-02-15',
      answer: 'Yes, it features Hybrid Active Noise Cancellation up to 35dB with Transparency mode.',
      answered_by: 'AcousticTech Seller',
      is_seller: true
    },
    {
      id: 'qa-2',
      question: 'What is the battery backup on a single full charge?',
      asked_by: 'Deepa S.',
      date: '2026-02-18',
      answer: 'You get up to 40 hours of playtime with ANC off and 30 hours with ANC on. Fast charging gives 4 hours playback in 10 mins.',
      answered_by: 'AcousticTech Seller',
      is_seller: true
    }
  ],
  'prod-012': [
    {
      id: 'qa-3',
      question: 'Are the mechanical switches hot-swappable?',
      asked_by: 'Vikram M.',
      date: '2026-03-01',
      answer: 'Yes, it comes with 5-pin hot-swappable sockets compatible with Cherry, Gateron, and Kailh switches.',
      answered_by: 'MechStrike Official',
      is_seller: true
    }
  ],
  'prod-101': [
    {
      id: 'qa-4',
      question: 'Is a charger included in the smartphone box?',
      asked_by: 'Ankit P.',
      date: '2026-03-05',
      answer: 'Yes, the box contains a 67W Turbo Fast Charger, USB-C braided cable, and protective clear TPU case.',
      answered_by: 'AeroTech Mobile',
      is_seller: true
    }
  ]
};

// Stock Alert Subscriptions Store
const STOCK_ALERTS = [];

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

export async function getSearchSuggestions(req, res) {
  try {
    const q = (req.query.q || '').trim().toLowerCase();
    if (!q || q.length < 2) {
      return res.json({ suggestions: [], products: [], brands: [] });
    }

    const all = await getAllProducts({}, req.dbType);
    const matchedProducts = all
      .filter(p =>
        p.product_name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q))
      )
      .slice(0, 6)
      .map(p => ({
        product_id: p.product_id,
        product_name: p.product_name,
        brand: p.brand,
        mrp: p.mrp,
        image_url: p.image_url,
        category_name: p.category_name
      }));

    const brands = Array.from(
      new Set(
        all
          .filter(p => p.brand && p.brand.toLowerCase().includes(q))
          .map(p => p.brand)
      )
    ).slice(0, 4);

    return res.json({
      query: q,
      products: matchedProducts,
      brands
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to get search suggestions.' });
  }
}

export async function getProductQA(req, res) {
  try {
    const { id } = req.params;
    const questions = QA_DATABASE[id] || [
      {
        id: `qa-default-${id}-1`,
        question: 'Is this an original genuine product covered under warranty?',
        asked_by: 'Customer',
        date: '2026-01-10',
        answer: 'Yes, 100% genuine product with 1-Year Official Manufacturer Warranty and 7-day easy replacement policy.',
        answered_by: 'Verified Seller',
        is_seller: true
      }
    ];
    return res.json(questions);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch Q&A.' });
  }
}

export async function postProductQuestion(req, res) {
  try {
    const { id } = req.params;
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question text is required.' });
    }

    if (!QA_DATABASE[id]) {
      QA_DATABASE[id] = [];
    }

    const newQA = {
      id: `qa-${Date.now()}`,
      question: question.trim(),
      asked_by: req.user ? (req.user.email.split('@')[0]) : 'Verified Buyer',
      date: new Date().toISOString().split('T')[0],
      answer: 'Thanks for your question! The seller will post a response shortly.',
      answered_by: 'PACIFIC Support Team',
      is_seller: false
    };

    QA_DATABASE[id].unshift(newQA);
    return res.status(201).json(newQA);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to post question.' });
  }
}

export async function subscribeStockAlert(req, res) {
  try {
    const { id } = req.params;
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required.' });
    }

    STOCK_ALERTS.push({
      product_id: id,
      email,
      subscribed_at: new Date().toISOString()
    });

    return res.json({
      success: true,
      message: `You'll be notified at ${email} as soon as this item is back in stock!`
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to register stock notification.' });
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
