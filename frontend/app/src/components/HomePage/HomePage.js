import React from "react";
import { useState } from "react";
import "./home.css";
import Sidebar from "./Sidebar";
const mock = {
  user: { name: "Алиса", role: "Сотрудник" },
  stats: {
    done: 3,
    total: 7,
    urgent: 2,
    overdue: 1,
    onReview: 1,
  },
  urgentTasks: [
    { id: 1, title: "Сдать отчёт по лаборатории №1", deadline: "Сегодня, 18:00", status: "В работе" },
    { id: 2, title: "Исправить баг авторизации", deadline: "Сегодня, 20:00", status: "Новая" },
    { id: 3, title: "Обновить документацию API", deadline: "Завтра, 12:00", status: "На проверке" },
  ],
  bossMessages: [
    { id: 1, from: "Начальник", text: "Проверь статусы задач до 16:00.", time: "10:24" },
    { id: 2, from: "Начальник", text: "Завтра созвон в 10:30. Подготовь краткий отчёт.", time: "09:11" },
  ],
  notifications: [
    { id: 1, text: "Уведомление от лаборатории №1М: добавлен новый протокол.", time: "11:05", isNew: true },
    { id: 2, text: "Срок задачи «Отчёт» истекает через 2 часа.", time: "10:50", isNew: true },
    { id: 3, text: "Система: пароль будет обновлён через 7 дней.", time: "Вчера", isNew: false },
  ],
};

function SidebarItem({ label, active }) {
  return (
    <button className={`sbItem ${active ? "active" : ""}`} type="button" aria-label={label}>
      <span className="sbIcon" />
    </button>
  );
}

function Card({ title, children, rightAction }) {
  return (
    <div className="card">
      <div className="cardHead">
        <div className="cardTitle">{title}</div>
        {rightAction ? <div className="cardAction">{rightAction}</div> : null}
      </div>
      <div className="cardBody">{children}</div>
    </div>
  );
}

export default function HomePage() {
  const { user, stats, urgentTasks, bossMessages, notifications } = mock;
  const progress = Math.round((stats.done / Math.max(stats.total, 1)) * 100);
  const [active, setActive] = useState("notif");

  return (
    <div className="homeWrap">
    <Sidebar activeId={active} onSelect={setActive} />

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="pageTitle">главная</div>

          <div className="topbarRight">
            <div className="avatar" />
            <div className="userBadge">
              <div className="userName">{user.name}</div>
              <div className="userRole">{user.role}</div>
            </div>
          </div>
        </header>

        <div className="content">
          {/* Left column */}
          <div className="colLeft">
            <Card
              title="Статус за сегодня"
              rightAction={<button className="linkBtn" type="button">Подробнее</button>}
            >
              <div className="statsRow">
                <div className="statBox">
                  <div className="statNum">{stats.done}/{stats.total}</div>
                  <div className="statLabel">выполнено</div>
                </div>

                <div className="statMiniGrid">
                  <div className="mini">
                    <div className="miniNum">{stats.urgent}</div>
                    <div className="miniLabel">срочных</div>
                  </div>
                  <div className="mini">
                    <div className="miniNum">{stats.overdue}</div>
                    <div className="miniLabel">просрочено</div>
                  </div>
                  <div className="mini">
                    <div className="miniNum">{stats.onReview}</div>
                    <div className="miniLabel">на проверке</div>
                  </div>
                  <div className="mini">
                    <div className="miniNum">{progress}%</div>
                    <div className="miniLabel">прогресс</div>
                  </div>
                </div>
              </div>

              <div className="progress">
                <div className="progressFill" style={{ width: `${progress}%` }} />
              </div>

              <div className="hint">
                Подсказка: сначала сделай UI на мок-данных, потом подключишь API `/api/dashboard`.
              </div>
            </Card>

            <Card
              title="Срочные задачи"
              rightAction={<button className="linkBtn" type="button">Все задачи</button>}
            >
              {urgentTasks.length === 0 ? (
                <div className="empty">Срочных задач нет 🎉</div>
              ) : (
                <div className="list">
                  {urgentTasks.map((t) => (
                    <div className="taskRow" key={t.id}>
                      <div className="taskMain">
                        <div className="taskTitle">{t.title}</div>
                        <div className="taskMeta">
                          <span className="pill">{t.status}</span>
                          <span className="dot" />
                          <span className="deadline">{t.deadline}</span>
                        </div>
                      </div>
                      <div className="taskActions">
                        <button className="btn" type="button">Открыть</button>
                        <button className="btn primary" type="button">Готово</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Center card (messages) */}
          <div className="colCenter">
            <Card
              title="Сообщения от начальника"
              rightAction={<button className="linkBtn" type="button">Все сообщения</button>}
            >
              {bossMessages.length === 0 ? (
                <div className="empty">Сообщений нет</div>
              ) : (
                <div className="msgList">
                  {bossMessages.map((m) => (
                    <div className="msgRow" key={m.id}>
                      <div className="msgAvatar" />
                      <div className="msgBody">
                        <div className="msgTop">
                          <div className="msgFrom">{m.from}</div>
                          <div className="msgTime">{m.time}</div>
                        </div>
                        <div className="msgText">{m.text}</div>
                        <div className="msgActions">
                          <button className="btn" type="button">Ответить</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right column (notifications) */}
          <div className="colRight">
            <Card
              title="Уведомления"
              rightAction={<button className="linkBtn" type="button">Очистить</button>}
            >
              {notifications.length === 0 ? (
                <div className="empty">Уведомлений нет</div>
              ) : (
                <div className="notifList">
                  {notifications.map((n) => (
                    <div className="notifRow" key={n.id}>
                      <div className={`badge ${n.isNew ? "new" : ""}`} />
                      <div className="notifText">{n.text}</div>
                      <div className="notifTime">{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
