import express from 'express';
import { pool } from './db.js';

export const categoriesRouter = express.Router();

// Alle Kategorien abrufen
categoriesRouter.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM categories ORDER BY id');
  res.json(result.rows);
});

// Neue Kategorie speichern
categoriesRouter.post('/', async (req, res) => {
  const { type, text, emoji } = req.body;

  if (!type || !text) {
    return res.status(400).json({ error: 'Type and text are required.' });
  }

  const result = await pool.query(
    'INSERT INTO categories (type, text, emoji) VALUES ($1, $2, $3) RETURNING *',
    [type, text, emoji]
  );

  res.status(201).json(result.rows[0]);
});

// Kategorie aktualisieren
categoriesRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, text, emoji } = req.body;

  const result = await pool.query(
    'UPDATE categories SET type=$1, text=$2, emoji=$3 WHERE id=$4 RETURNING *',
    [type, text, emoji, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Category not found.' });
  }

  res.json(result.rows[0]);
});

// Kategorie löschen
categoriesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM categories WHERE id=$1', [id]);
  res.json({ success: true });
});
