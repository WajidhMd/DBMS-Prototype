import {
  getAllCategories,
  createCategory as insertCategory,
  updateCategory as modifyCategory,
  deleteCategory as removeCategory
} from '../services/dbAdapter.js';

export async function getCategories(req, res) {
  try {
    const categories = await getAllCategories(req.dbType);
    return res.json(categories);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

export async function createCategory(req, res) {
  try {
    const { category_name, description } = req.body;
    if (!category_name) {
      return res.status(400).json({ error: 'Category name is required.' });
    }
    const catData = {
      category_id: `cat-${Date.now()}`,
      category_name,
      description: description || ''
    };
    const created = await insertCategory(catData, req.dbType);
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create category.' });
  }
}

export async function updateCategory(req, res) {
  try {
    const updated = await modifyCategory(req.params.id, req.body, req.dbType);
    if (!updated) return res.status(404).json({ error: 'Category not found.' });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update category.' });
  }
}

export async function deleteCategory(req, res) {
  try {
    await removeCategory(req.params.id, req.dbType);
    return res.json({ message: 'Category deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete category.' });
  }
}
