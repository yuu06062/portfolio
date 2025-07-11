// ユーザー情報の型定義
export interface User {
  id: number;
  username: string;
}

// TODO情報の型定義
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

// 型ガード関数
export function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.username === 'string';
}

export function isLoginResponse(obj: any): obj is LoginResponse {
  return obj && typeof obj.id === 'number' && typeof obj.username === 'string';
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return obj && typeof obj.error === 'string';
}

export function isTodoResponse(obj: any): obj is TodoResponse {
  return obj && 
    typeof obj.id === 'number' && 
    typeof obj.text === 'string' && 
    typeof obj.completed === 'number' && 
    typeof obj.user_id === 'number';
}