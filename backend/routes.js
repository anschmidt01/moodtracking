import express from 'express';
import { pool } from './db.js';

export const router = express.Router();

// Neue Stimmung speichern
router.post('/moods', async (req, res) => {
  const { date, mood, activities, notes } = req.body;
  const result = await pool.query(
    'INSERT INTO moods (date, mood, activities, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [date, mood, activities, notes]
  );
  res.status(201).json(result.rows[0]);
});

// Alle Stimmungen abrufen
router.get('/moods', async (req, res) => {
  const result = await pool.query('SELECT * FROM moods ORDER BY date DESC');
  res.json(result.rows);
});

// Statistik abrufen
router.get('/statistics', async (req, res) => {
  const result = await pool.query(`
    SELECT mood, COUNT(*)::int AS count
    FROM moods
    GROUP BY mood
  `);
  res.json(result.rows);
});

// Eintrag aktualisieren
router.put('/moods/:id', async (req, res) => {
  const { id } = req.params;
  const { date, mood, activities, notes } = req.body;
  const result = await pool.query(
    'UPDATE moods SET date=$1, mood=$2, activities=$3, notes=$4 WHERE id=$5 RETURNING *',
    [date, mood, activities, notes, id]
  );
  res.json(result.rows[0]);
});

// Eintrag löschen
router.delete('/moods/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM moods WHERE id=$1', [id]);
  res.json({ success: true });
});
