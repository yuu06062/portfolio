"use strict";
// サーバーサイド用の型定義
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseUser = isDatabaseUser;
exports.isDatabaseTodo = isDatabaseTodo;
exports.toUser = toUser;
exports.toTodo = toTodo;
// 型ガード関数
function isDatabaseUser(obj) {
    return obj &&
        typeof obj.id === 'number' &&
        typeof obj.username === 'string' &&
        typeof obj.password === 'string';
}
function isDatabaseTodo(obj) {
    return obj &&
        typeof obj.id === 'number' &&
        typeof obj.text === 'string' &&
        typeof obj.completed === 'number' &&
        typeof obj.user_id === 'number';
}
// データベースユーザーをクライアント用ユーザーに変換する関数
function toUser(dbUser) {
    return {
        id: dbUser.id,
        username: dbUser.username
    };
}
// データベースTODOをクライアント用TODOに変換する関数
function toTodo(dbTodo) {
    return {
        id: dbTodo.id,
        text: dbTodo.text,
        completed: dbTodo.completed,
        user_id: dbTodo.user_id
    };
}
