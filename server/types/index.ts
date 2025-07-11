// サーバーサイド用の型定義

// データベースのユーザー情報の型定義
export interface DatabaseUser {
  id: number;
  username: string;
  password: string;
}

// データベースのTODO情報の型定義
export interface DatabaseTodo {
  id: number;
  text: string;
  completed: number;
  user_id: number;
}

// クライアントに送信するユーザー情報の型定義
export interface User {
  id: number;
  username: string;
}

// クライアントに送信するTODO情報の型定義
export interface Todo {
  id: number;
  text: string;
  completed: number;
  user_id: number;
}

// APIレスポンスの型定義
export interface LoginResponse {
  id: number;
  username: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
}

export interface TodoResponse {
  id: number;
  text: string;
  completed: number;
  user_id: number;
}

export interface ErrorResponse {
  error: string;
}

// APIリクエストの型定義
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface TodoRequest {
  text: string;
  completed: number;
}

export interface TodoUpdateRequest {
  id: number;
  text?: string;
  completed?: number;
}

// SQLiteクエリ結果の型定義
export interface SqliteRow {
  [key: string]: any;
}

// 型ガード関数
export function isDatabaseUser(obj: any): obj is DatabaseUser {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.username === 'string' && 
    typeof obj.password === 'string';
}

export function isDatabaseTodo(obj: any): obj is DatabaseTodo {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.text === 'string' && 
    typeof obj.completed === 'number' && 
    typeof obj.user_id === 'number';
}

// データベースユーザーをクライアント用ユーザーに変換する関数
export function toUser(dbUser: DatabaseUser): User {
  return {
    id: dbUser.id,
    username: dbUser.username
  };
}

// データベースTODOをクライアント用TODOに変換する関数
export function toTodo(dbTodo: DatabaseTodo): Todo {
  return {
    id: dbTodo.id,
    text: dbTodo.text,
    completed: dbTodo.completed,
    user_id: dbTodo.user_id
  };
}