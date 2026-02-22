import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database("database.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS animations (
    id TEXT PRIMARY KEY,
    userId INTEGER,
    prompt TEXT,
    html TEXT,
    css TEXT,
    js TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Routes
  app.post("/api/register", (req, res) => {
    const { username, password } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
      stmt.run(username, password);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: "Kullanıcı adı zaten alınmış." });
    }
  });

  app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ? AND password = ?").get(username, password);
    if (user) {
      res.json({ success: true, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre." });
    }
  });

  // Animation Routes
  app.post("/api/animations", (req, res) => {
    const { id, userId, prompt, html, css, js } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO animations (id, userId, prompt, html, css, js) VALUES (?, ?, ?, ?, ?, ?)");
      stmt.run(id, userId, prompt, html, css, js);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Animasyon kaydedilemedi." });
    }
  });

  app.get("/api/animations/:id", (req, res) => {
    const animation = db.prepare("SELECT * FROM animations WHERE id = ?").get(req.params.id);
    if (animation) {
      res.json(animation);
    } else {
      res.status(404).json({ error: "Animasyon bulunamadı." });
    }
  });

  app.get("/api/users/:userId/animations", (req, res) => {
    const animations = db.prepare("SELECT * FROM animations WHERE userId = ? ORDER BY createdAt DESC").all(req.params.userId);
    res.json(animations);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
