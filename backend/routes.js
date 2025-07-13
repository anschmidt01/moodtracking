import express from 'express';
import { pool } from './db.js';

export const router = express.Router();

// Eintrag erstellen
router.post('/moods', async (req, res) => {
  try {
    const { date, mood_id, activity_ids, notes } = req.body;

    if (!date || !mood_id) {
      return res.status(400).json({ error: 'Date and mood_id are required.' });
    }

    const result = await pool.query(
      `
      INSERT INTO moods (date, mood_id, activity_ids, notes)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [date, mood_id, activity_ids, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting mood:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Alle Einträge abrufen (inkl. Mood & Activities)
router.get('/moods', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        m.id,
        m.date,
        m.notes,
        row_to_json(mood_cat) AS mood,
        (
          SELECT json_agg(row_to_json(act_cat))
          FROM unnest(m.activity_ids) AS aid
          JOIN categories act_cat ON act_cat.id = aid
        ) AS activities
      FROM moods m
      JOIN categories mood_cat ON mood_cat.id = m.mood_id
      ORDER BY m.date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching moods:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Statistik abrufen (Counts pro Mood)
router.get('/statistics', async (req, res) => {
  const result = await pool.query(`
    SELECT mood_id, COUNT(*)::int AS count
    FROM moods
    GROUP BY mood_id
  `);
  res.json(result.rows);
});

// Eintrag aktualisieren
router.put('/moods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mood_id, activity_ids, notes } = req.body;

    const result = await pool.query(
      `
      UPDATE moods
      SET date=$1, mood_id=$2, activity_ids=$3, notes=$4
      WHERE id=$5
      RETURNING *
      `,
      [date, mood_id, activity_ids, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Entry not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating mood:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Eintrag löschen
router.delete('/moods/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM moods WHERE id=$1', [id]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting mood:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
