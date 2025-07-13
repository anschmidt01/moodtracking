import express from 'express';
import { pool } from './db.js';

export const categoriesRouter = express.Router();

// Alle Kategorien abrufen
categoriesRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Neue Kategorie speichern
categoriesRouter.post('/', async (req, res) => {
  try {
    const { type, text, emoji, color } = req.body;

    if (!type || !text) {
      return res.status(400).json({ error: 'Type and text are required.' });
    }

    const result = await pool.query(
      'INSERT INTO categories (type, text, emoji, color) VALUES ($1, $2, $3, $4) RETURNING *',
      [type, text, emoji, color]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting category:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Kategorie aktualisieren
categoriesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, text, emoji, color } = req.body;

    const result = await pool.query(
      `
      UPDATE categories
      SET type = $1,
          text = $2,
          emoji = $3,
          color = $4
      WHERE id = $5
      RETURNING *
      `,
      [type, text, emoji, color, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Kategorie löschen
categoriesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM categories WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
