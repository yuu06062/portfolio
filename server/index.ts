console.log("=== THIS IS THE index.ts YOU ARE EDITING ===");

import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { 
  DatabaseUser, 
  DatabaseTodo, 
  LoginRequest, 
  RegisterRequest, 
  TodoRequest, 
  TodoUpdateRequest,
  LoginResponse,
  RegisterResponse,
  TodoResponse,
  ErrorResponse,
  toUser,
  toTodo,
  isDatabaseUser,
  isDatabaseTodo
} from "./types/index";

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
  db.all("SELECT * FROM todos WHERE user_id = ?", [user_id], (err, rows: DatabaseTodo[]) => {
    if (err) {
      const errorResponse: ErrorResponse = { error: err.message };
      res.status(500).json(errorResponse);
      return;
    }
    const todos = rows.map(row => toTodo(row));
    res.json(todos);
  });
});

// ★ここに追加
app.get("/cors-test", (req, res) => {
  res.json({ message: "CORS OK" });
});

// TODO追加API
app.post("/api/todos", (req, res) => {
  const { text, user_id }: TodoRequest & { user_id: number } = req.body;
  db.run(
    "INSERT INTO todos (text, completed, user_id) VALUES (?, ?, ?)",
    [text, 0, user_id],
    function (err) {
      if (err) {
        const errorResponse: ErrorResponse = { error: err.message };
        res.status(500).json(errorResponse);
        return;
      }
      const todoResponse: TodoResponse = { 
        id: this.lastID as number, 
        text, 
        completed: 0, 
        user_id 
      };
      res.json(todoResponse);
    }
  );
});

// TODO完了状態の更新API
app.put("/api/todos/:id", (req, res) => {
  const { completed }: Pick<TodoUpdateRequest, 'completed'> = req.body;
  const todoId = parseInt(req.params.id);
  db.run("UPDATE todos SET completed = ? WHERE id = ?", [completed, todoId], function (err) {
    if (err) {
      const errorResponse: ErrorResponse = { error: err.message };
      res.status(500).json(errorResponse);
      return;
    }
    res.json({ id: todoId, completed });
  });
});

// TODO削除API
app.delete("/api/todos/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  db.run("DELETE FROM todos WHERE id = ?", [todoId], function (err) {
    if (err) {
      const errorResponse: ErrorResponse = { error: err.message };
      res.status(500).json(errorResponse);
      return;
    }
    res.json({ id: todoId });
  });
});



app.post("/api/register", (req, res) => {
  console.log("register called", req.body);
  const { username, password }: RegisterRequest = req.body;
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        const errorResponse: ErrorResponse = { error: "ユーザー名が既に使われています" };
        res.status(400).json(errorResponse);
        return;
      }
      const registerResponse: RegisterResponse = { 
        id: this.lastID as number, 
        username 
      };
      res.json(registerResponse);
    }
  );
});

app.post("/api/login", (req, res) => {
  const { username, password }: LoginRequest = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    (err, row: DatabaseUser | undefined) => { 
      if (err) {
        const errorResponse: ErrorResponse = { error: "DBエラー" };
        res.status(500).json(errorResponse);
        return;
      }
      if (!row) {
        const errorResponse: ErrorResponse = { error: "ユーザー名またはパスワードが違います" };
        res.status(401).json(errorResponse);
        return;
      }
      const loginResponse: LoginResponse = toUser(row);
      res.json(loginResponse);
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