const API_URL = "http://localhost:5195";

async function request(url, options = {}) {
  const res = await fetch(API_URL + url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}

// ===== USERS =====
export function getUsers() {
  return request("/api/users");
}
