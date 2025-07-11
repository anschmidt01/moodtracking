import {pool} from './db.js';

(async () => {
  //Mood Tabelle
  await pool.query(`
    CREATE TABLE IF NOT EXISTS moods (
      id SERIAL PRIMARY KEY,
      date DATE NOT NULL,
      mood TEXT NOT NULL,
      activities TEXT[],
      notes TEXT
    )
  `);
    //Kategorien Tabelle
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL,    -- 'mood' oder 'activity'
      text VARCHAR(100) NOT NULL,   -- Name
      emoji VARCHAR(10)             -- nur bei mood
    )
  `);

  console.log('Table created.');
  process.exit();
})();

