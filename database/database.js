// database.js
const Database = require('better-sqlite3');
const db = new Database('themepark.db'); // this creates themepark.db file

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS attractions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    area_id INTEGER,
    FOREIGN KEY (area_id) REFERENCES areas(id)
  );
`);
const db = require('better-sqlite3')('themepark.db');

// Run once to update image paths
db.exec(`
  UPDATE areas SET image = '/img/dv.jpg' WHERE name = 'Dino Valley';
  UPDATE areas SET image = '/img/dv1.jpg' WHERE name = 'Space Zone';
`);

console.log("Image paths updated.");



module.exports = db;
