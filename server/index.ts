console.log("=== THIS IS THE index.ts YOU ARE EDITING ===");

import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

const app = express();
const PORT = 4000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("express.json() loaded");

// SQLiteデータベースファイルを作成・接続
const db = new sqlite3.Database("todos.db");

// テーブルがなければ作成
db.run("CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, completed INTEGER)");

db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);


// TODO一覧取得API
app.get("/api/todos", (req, res) => {
  const user_id = req.query.user_id;
  db.all("SELECT * FROM todos WHERE user_id = ?", [user_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// ★ここに追加
app.get("/cors-test", (req, res) => {
  res.json({ message: "CORS OK" });
});

// TODO追加API
app.post("/api/todos", (req, res) => {
  const { text, user_id } = req.body;
  db.run(
    "INSERT INTO todos (text, completed, user_id) VALUES (?, ?, ?)",
    [text, 0, user_id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, text, completed: 0, user_id });
    }
  );
});

// TODO完了状態の更新API
app.put("/api/todos/:id", (req, res) => {
  const { completed } = req.body;
  db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed, req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id, completed });
  });
});

// TODO削除API
app.delete("/api/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: req.params.id });
  });
});



app.post("/api/register", (req, res) => {
  console.log("register called", req.body); // ←追加
  const { username, password } = req.body;
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        res.status(400).json({ error: "ユーザー名が既に使われています" });
        return;
      }
      res.json({ id: this.lastID, username });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row: any) => { 
      if (err) {
        res.status(500).json({ error: "DBエラー" });
        return;
      }
      if (!row) {
        res.status(401).json({ error: "ユーザー名またはパスワードが違います" });
        return;
      }
      res.json({ id: row.id, username: row.username });
    }
  );
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // setTimeout(() => {
  //   console.log(
  //     app._router.stack
  //       .filter((r: any) => r.route)
  //       .map((r: any) => r.route.path + ' [' + Object.keys(r.route.methods).join(',').toUpperCase() + ']')
  //   );
  // }, 100);
});