import type { Middleware } from "@reduxjs/toolkit";
type Past = { state: any }[];
const MAX = 20;
const whitelist = new Set([
  "cards/addCard",
  "cards/updateCard",
  "cards/deleteCard",
  "columns/addColumn",
  "columns/updateColumn",
  "columns/deleteColumn",
  "cards/moveCard",
  "columns/moveColumn",
]);
const stack: Past = [];
let cursor = -1;
let seeded = false;
export const historyMiddleware: Middleware = (store) => (next) => (action) => {
  if (!seeded) {
    stack.push({ state: store.getState() });
    cursor = 0;
    seeded = true;
  }
  const result = next(action);
  if (whitelist.has(action.type)) {
    stack.splice(cursor + 1);
    stack.push({ state: store.getState() });
    if (stack.length > MAX) stack.shift();
    cursor = stack.length - 1;
  }
  if (action.type === "ui/undo") {
    if (cursor > 0) {
      cursor--;
      const snap = stack[cursor];
      (store as any).dispatch({
        type: "__REPLACE_STATE__",
        payload: snap.state,
      });
    }
  }
  if (action.type === "ui/redo") {
    if (cursor < stack.length - 1) {
      cursor++;
      const snap = stack[cursor];
      (store as any).dispatch({
        type: "__REPLACE_STATE__",
        payload: snap.state,
      });
    }
  }
  return result;
};
