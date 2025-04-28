import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let db;

async function initDb() {
  db = await open({
    filename: path.join(__dirname, "database/park.db"),
    driver: sqlite3.Database
  });

  await db.exec(`CREATE TABLE IF NOT EXISTS areas (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL
  );`);

  await db.exec(`CREATE TABLE IF NOT EXISTS attractions (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    area_id INTEGER,
    description TEXT,
    FOREIGN KEY(area_id) REFERENCES areas(id)
  );`);

  const Database = require('better-sqlite3');

// Connect to your DB file
const db = new Database('themepark.db');

// Update image paths
db.exec(`
  UPDATE areas SET image = '/img/dv.jpg' WHERE name = 'Dino Valley';
  UPDATE areas SET image = '/img/dv1.jpg' WHERE name = 'Space Zone';
  UPDATE areas SET image = '/img/dv.jpg' WHERE name = 'Pirate Bay';
`);

console.log("✅ Image paths updated successfully.");


  const existing = await db.all("SELECT COUNT(*) AS count FROM areas;");
  if (existing[0].count === 0) {
    await db.run("INSERT INTO areas (name, description, image) VALUES (?, ?, ?)", [
        "Dino Valley",  // Name of the area
        "Jurassic thrills with dinosaurs and fossil fun!",  // Description
        "/img/dv1.jpg"  // Image path
      ]);
      
    await db.run("INSERT INTO areas (name, description, image) VALUES (?, ?, ?)", [
        "Space Zone",
        "Launch into orbit with rockets and aliens!",
        "/img/sp1.jpg"
      ]);
      
    await db.run("INSERT INTO areas (name, description, image) VALUES (?, ?, ?)", [
        "Pirate Bay",
        "Set sail for treasure and water adventures!",
        "/img/pb.jpg"
      ]);
      

    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "T-Rex Terror", 1, "High-speed coaster through a dinosaur jungle."
    ]);
    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "Fossil Dig", 1, "Interactive fossil excavation game for kids."
    ]);
    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "Galactic Spin", 2, "Spinning ride through space with lights and sounds."
    ]);
    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "Rocket Racer", 2, "Race your friends to the moon!"
    ]);
    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "Pirate Plunge", 3, "Massive water drop on a pirate ship."
    ]);
    await db.run("INSERT INTO attractions (name, area_id, description) VALUES (?, ?, ?)", [
      "Treasure Trail", 3, "Find gold through a scavenger maze."
    ]);
  }
}

app.get("/", (req, res) => {
  res.render("index", { openHours: "Open daily April–October: 9am – 7pm" });
});

app.use(express.static('public'));

app.get("/areas", async (req, res) => {
  const areas = await db.all("SELECT * FROM areas");
  const attractions = await db.all("SELECT * FROM attractions");
  res.render("areas", { 
    areas, 
    attractions, 
    openHours: "Open daily April–October: 9am – 7pm" 
  });
});


app.get("/faq", (req, res) => {
  res.render("faq", { openHours: "Open daily April–October: 9am – 7pm" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { openHours: "Open daily April–October: 9am – 7pm" });
});

app.post("/contact", (req, res) => {
  // In real life you'd store or email this
  console.log("Contact form submitted:", req.body);
  res.send("Thanks for your message!");
});

app.use((req, res) => {
  res.status(404).render("404", { openHours: "Open daily April–October: 9am – 7pm" });
});



console.log("Starting app...");

initDb()
  .then(() => {
    console.log("DB initialised"); // ✅ NEW LINE
    app.listen(PORT, () => {
      console.log(`Adventure Kingdom running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialise DB:", err); // ✅ Catch errors
  });
