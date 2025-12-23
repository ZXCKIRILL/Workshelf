// src/api/index.js
import { get, post } from "./http";

export const api = {
  home: () => get("/api/home"),
  me: () => get("/api/users/me"),
  calendar: () => get("/api/calendar"),

  // пример на будущее
  login: (email, password) => post("/api/auth/login", { email, password }),
};
