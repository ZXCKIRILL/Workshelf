import React, { useEffect, useState } from "react";
import Sidebar from "../HomePage/Sidebar";
import "./users.css";
import { getUsers } from "../../api/api"; // путь проверь: src/api/api.js

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers()
      .then((list) => {
        const safe = Array.isArray(list) ? list.filter(Boolean) : [];
        setUsers(safe);
        setSelected(safe[0] || null);
      })
      .catch((e) => {
        console.error("USERS LOAD ERROR:", e);
        setUsers([]);
        setSelected(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const fullName = selected
    ? `${selected.lastName || ""} ${selected.firstName || ""} ${selected.patronymic || ""}`.trim()
    : "Нет данных";

  return (
    <div className="homeWrap">
      <Sidebar />

      <div className="homeMain">
        <header className="homeTopbar">
          <div className="homeTitle">сотрудники</div>
        </header>

        <div style={{ margin: 14, background: "#f2f2f2", padding: 20 }}>
          {loading && <div>Загрузка...</div>}

          {!loading && users.length === 0 && (
            <div>Нет сотрудников (API не вернул список)</div>
          )}

          {!loading && users.length > 0 && (
            <>
              <div style={{ display: "flex", gap: 20 }}>
                <div style={{ width: 240 }}>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => setSelected(u)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: 10,
                        marginBottom: 8,
                        border: "1px solid #aaa",
                        background: selected?.id === u.id ? "#ddd" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      {(u.lastName || "") + " " + (u.firstName || "")}
                    </button>
                  ))}
                </div>

                <div style={{ flex: 1, border: "1px solid #aaa", padding: 16 }}>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <div
                      style={{
                        width: 120,
                        height: 120,
                        borderRadius: "50%",
                        background: "#b54848",
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>{fullName}</div>
                      <div style={{ marginTop: 6 }}>
                        Пол: {selected?.gender || "—"}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        Дата рождения: {selected?.birthDate || "—"}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        Номер отдела: {selected?.departmentNumber || "—"}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        Номер сотрудника: {selected?.employeeNumber || "—"}
                      </div>
                      <div style={{ marginTop: 6 }}>
                        Стаж: {selected?.experience || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
