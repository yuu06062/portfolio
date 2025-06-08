import React, { useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: number;
};

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);

  // TODO一覧取得
  useEffect(() => {
    fetch("http://localhost:4000/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  // TODO追加
  const addTodo = () => {
    if (text.trim() === "") return;
    fetch("http://localhost:4000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then(res => res.json())
      .then(newTodo => {
        setTodos([...todos, newTodo]);
        setText("");
      });
  };

  // TODO削除
  const deleteTodo = (id: number) => {
    fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTodos(todos.filter(todo => todo.id !== id));
    });
  };

  // TODO完了切り替え
  const toggleTodo = (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    fetch(`http://localhost:4000/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: todo.completed ? 0 : 1 }),
    }).then(() => {
      setTodos(
        todos.map(t =>
          t.id === id ? { ...t, completed: t.completed ? 0 : 1 } : t
        )
      );
    });
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>TODOリスト</h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="やることを入力"
      />
      <button onClick={addTodo}>追加</button>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ margin: "8px 0" }}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
                marginRight: "1rem",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
