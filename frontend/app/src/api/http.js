// src/api/http.js

const USE_MOCKS = false; 
const API_URL = "http://localhost:5195";

// --------- МОКИ (пока бекенд не нужен) ----------
const mocks = {
  "/api/home": {
    currentUser: { id: 1, name: "Сергей Кузнецов" },
    urgentTasks: [
      { id: 1, title: "Срочная задача №1" },
      { id: 2, title: "Срочная задача №2" },
    ],
    bossMessages: [{ id: 10, text: "Сообщение от начальника" }],
    labNotifications: [
      { id: 20, text: "Уведомление от лаборатории №1" },
      { id: 21, text: "Уведомление от лаборатории №2" },
    ],
  },

  "/api/users/me": {
    lastName: "Кузнецов",
    firstName: "Сергей",
    patronymic: "Иванович",
    gender: "мужчина",
    birthday: "12.09.1992",
    dept: "№23.06",
    employeeId: "№458213",
    exp: "5 лет.",
  },

  "/api/calendar": {
    events: [
      { id: 1, title: "Созвон", date: "2025-12-22", time: "10:00" },
      { id: 2, title: "Встреча", date: "2025-12-23", time: "14:00" },
    ],
  },
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function get(path) {
  if (USE_MOCKS) {
    await delay(200);
    if (!(path in mocks)) throw new Error(`Нет mock для ${path}`);
    return mocks[path];
  }

  const res = await fetch(API_URL + path);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export async function post(path, body) {
  if (USE_MOCKS) {
    await delay(200);
    return { ok: true };
  }

  const res = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return res.json();
}