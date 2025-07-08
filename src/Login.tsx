import React, { useState } from "react";
import { User, LoginResponse, ErrorResponse, isLoginResponse, isErrorResponse } from "./types/index";

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (isLoginResponse(data)) {
          onLogin(data);
        } else {
          setError("レスポンスの形式が正しくありません");
        }
      } else {
        if (isErrorResponse(data)) {
          setError(data.error);
        } else {
          setError("ログイン失敗");
        }
      }
    } catch {
      setError("通信エラー");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>ログイン</h2>
      <div>
        <input
          type="text"
          placeholder="ユーザー名"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">ログイン</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}