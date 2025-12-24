// src/api/client.js

const API_BASE_URL = "http://localhost:5195/api";

// ✅ Всегда используем реальный бэкенд (моки больше не нужны)
const USE_MOCKS = false;

// Для отладки: можно временно включить логи
const DEBUG = false;

// Базовая функция запроса — универсальная
async function request(method, endpoint, data = null, config = {}) {
  const url = API_BASE_URL + endpoint;

  const headers = {
    "Content-Type": "application/json",
    // Если будет авторизация — добавим токен позже:
  };

  const options = {
    method,
    headers,
    ...config,
  };

  if (data !== null) {
    options.body = JSON.stringify(data);
  }

  if (DEBUG) {
    console.log(`[API] ${method} ${url}`, data);
  }

  try {
    const response = await fetch(url, options);

    if (DEBUG) {
      console.log(`[RESPONSE] ${response.status} ${response.url}`);
    }

    // 2xx → OK
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      }
      return await response.text();
    }

    // Обработка ошибок
    let errorDetail = await response.text();
    try {
      const json = JSON.parse(errorDetail);
      errorDetail = json.message || json.title || json;
    } catch {}

    const error = new Error(`HTTP ${response.status}: ${errorDetail}`);
    error.status = response.status;
    error.response = response;
    throw error;
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Нет соединения с сервером. Проверьте, запущен ли вобще чертов бэкенд 6(.");
    }
    throw err;
  }
}

// Экспортируем методы
export const api = {
  get: (endpoint) => request("GET", endpoint),
  post: (endpoint, data) => request("POST", endpoint, data),
  put: (endpoint, data) => request("PUT", endpoint, data),
  patch: (endpoint, data) => request("PATCH", endpoint, data),
  delete: (endpoint) => request("DELETE", endpoint),

  // Специализированные методы (по контроллерам)
  // Пользователи 
  users: {
    getAll: () => api.get("/users"),
    getById: (id) => api.get(`/users/${id}`),
    create: (dto) => api.post("/users", dto),
    update: (id, dto) => api.put(`/users/${id}`, dto),
    delete: (id) => api.delete(`/users/${id}`),
  },

  // Профили 
  profiles: {
    get: (userId) => api.get(`/userprofiles/${userId}`),
    update: (userId, dto) => api.put(`/userprofiles/${userId}`, dto),
    delete: (userId) => api.delete(`/userprofiles/${userId}`),
  },

  // Задачи 
  tasks: {
    getAll: () => api.get("/tasks"),
    getById: (id) => api.get(`/tasks/${id}`),
    create: (dto) => api.post("/tasks", dto),
    update: (id, dto) => api.put(`/tasks/${id}`, dto),
    delete: (id) => api.delete(`/tasks/${id}`),
  },

  // Назначения задач 
  assignments: {
    getAll: () => api.get("/taskassignments"),
    assign: (dto) => api.post("/taskassignments", dto),
  },

  // Комментарии к задачам 
  comments: {
    getByTask: (taskId) => api.get(`/taskcomments/task/${taskId}`),
    add: (dto) => api.post("/taskcomments", dto),
  },

  //  Файлы задач 
  files: {
    getByTask: (taskId) => api.get(`/taskfiles/task/${taskId}`),
    upload: (dto) => api.post("/taskfiles", dto),
  },

  // Уведомления
  notifications: {
    getByUser: (userId) => api.get(`/notifications/user/${userId}`),
    create: (dto) => api.post("/notifications", dto),
    markAsRead: (id) => api.patch(`/notifications/${id}/mark-read`),
    delete: (id) => api.delete(`/notifications/${id}`),
  },

  // Отделы 
  departments: {
    getAll: () => api.get("/departments"),
    getById: (id) => api.get(`/departments/${id}`),
    create: (dto) => api.post("/departments", dto),
    update: (id, dto) => api.put(`/departments/${id}`, dto),
    delete: (id) => api.delete(`/departments/${id}`),
  },

  // Логи аудита 
  auditLogs: {
    getAll: () => api.get("/auditlogs"),
    getByUser: (userId) => api.get(`/auditlogs/user/${userId}`),
    delete: (id) => api.delete(`/auditlogs/${id}`),
  },

  // Дополнительно: "Home" данные
  // Ты пока не реализовал `/api/home` на бэкенде — давай добавим!
  home: {
    get: () => api.get("/home"), // ← нужно реализовать HomeController (см. ниже)
  },
};