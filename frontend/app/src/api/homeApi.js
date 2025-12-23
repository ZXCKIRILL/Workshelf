// src/api/homeApi.js

// ⚠️ сейчас мы работаем БЕЗ бекенда
const USE_MOCKS = true;

// на будущее
const API_URL = "http://localhost:5195";

// -------- МОКИ под HomePage --------
const mockHomeData = {
  currentUser: {
    id: 1,
    name: "Сергей Кузнецов",
  },
  urgentTasks: [
    { id: 1, title: "Срочная задача №1" },
    { id: 2, title: "Срочная задача №2" },
  ],
  bossMessages: [
    { id: 1, text: "Сообщение от начальника" },
  ],
  labNotifications: [
    { id: 1, text: "Уведомление от лаборатории №1" },
    { id: 2, text: "Уведомление от лаборатории №2" },
  ],
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function getHomeData() {
  if (USE_MOCKS) {
    await delay(300); // имитация запроса
    return mockHomeData;
  }

  const res = await fetch(`${API_URL}/api/home`);
  if (!res.ok) throw new Error("Home API error");
  return res.json();
}
