import {pool} from './db.js';

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS moods (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      mood TEXT NOT NULL,
      activities TEXT[],
      notes TEXT
    )
  `);
  console.log('Table created.');
  process.exit();
})();

