import React, { useState, useEffect } from "react";
import "./home.css";
import Sidebar from "./Sidebar";
import api from "../../api";

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
  const [active, setActive] = useState("notif");
  const [stats, setStats] = useState({
    done: 0,
    total: 0,
    urgent: 0,
    overdue: 0,
    onReview: 0,
  });
  const [urgentTasks, setUrgentTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "Алиса", role: "Сотрудник" });
  const [bossMessages, setBossMessages] = useState([]);

  // Загрузка данных для дашборда
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Загружаем задачи
        const tasksResponse = await api.get('/tasks');
        const tasks = tasksResponse.data;
        
        // Загружаем уведомления для текущего пользователя
        const notifResponse = await api.get('/notifications/user/1'); // ID текущего пользователя
        const notificationsData = notifResponse.data;
        
        // Загружаем аудит логи (для сообщений от начальника)
        const auditLogsResponse = await api.get('/auditlogs');
        
        // Вычисляем статистику
        const totalTasks = tasks.length;
        const doneTasks = tasks.filter(t => t.status === "Done").length;
        const urgentTasksList = tasks.filter(t => t.priority >= 3);
        const overdueTasks = tasks.filter(t => new Date(t.endDate) < new Date() && t.status !== "Done");
        const reviewTasks = tasks.filter(t => t.status === "InReview");
        
        setStats({
          done: doneTasks,
          total: totalTasks,
          urgent: urgentTasksList.length,
          overdue: overdueTasks.length,
          onReview: reviewTasks.length,
        });
        
        // Форматируем срочные задачи
        const formattedUrgentTasks = urgentTasksList.slice(0, 3).map(task => ({
          id: task.id,
          title: task.title,
          deadline: new Date(task.endDate).toLocaleDateString('ru-RU', { 
            weekday: 'long', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: task.status
        }));
        setUrgentTasks(formattedUrgentTasks);
        
        // Форматируем уведомления
        const formattedNotifications = notificationsData.slice(0, 3).map(notif => ({
          id: notif.id,
          text: notif.message,
          time: new Date(notif.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          isNew: !notif.isRead,
        }));
        setNotifications(formattedNotifications);
        
        // Форматируем сообщения от начальника (из аудит логов)
        const formattedMessages = auditLogsResponse.data
          .filter(log => log.userId === 1) // ID начальника
          .slice(0, 2)
          .map(log => ({
            id: log.id,
            from: "Начальник",
            text: `${log.action}: ${log.entityType} #${log.entityId}`,
            time: new Date(log.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          }));
        setBossMessages(formattedMessages);
        
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Обработка готовности задачи
  const handleTaskComplete = async (taskId) => {
    try {
      const taskToUpdate = urgentTasks.find(t => t.id === taskId);
      if (taskToUpdate) {
        await api.put(`/tasks/${taskId}`, {
          ...taskToUpdate,
          status: "Done"
        });
        
        // Обновляем список задач
        setUrgentTasks(prev => prev.filter(t => t.id !== taskId));
        setStats(prev => ({ ...prev, done: prev.done + 1 }));
      }
    } catch (error) {
      console.error("Ошибка обновления задачи:", error);
    }
  };

  // Отметить уведомление как прочитанное
  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/mark-read`);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error("Ошибка обновления уведомления:", error);
    }
  };

  // Очистить все уведомления
  const handleClearNotifications = async () => {
    try {
      for (const notif of notifications) {
        await api.delete(`/notifications/${notif.id}`);
      }
      setNotifications([]);
    } catch (error) {
      console.error("Ошибка удаления уведомлений:", error);
    }
  };

  const progress = Math.round((stats.done / Math.max(stats.total, 1)) * 100);

  return (
    <div className="homeWrap">
      <Sidebar activeId={active} onSelect={setActive} />

      <div className="main">
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
          {loading ? (
            <div className="loading">Загрузка данных...</div>
          ) : (
            <>
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
                            <button 
                              className="btn primary" 
                              type="button"
                              onClick={() => handleTaskComplete(t.id)}
                            >
                              Готово
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

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

              <div className="colRight">
                <Card
                  title="Уведомления"
                  rightAction={
                    <button className="linkBtn" type="button" onClick={handleClearNotifications}>
                      Очистить
                    </button>
                  }
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
                          {n.isNew && (
                            <button 
                              className="markReadBtn" 
                              type="button"
                              onClick={() => handleMarkAsRead(n.id)}
                              title="Отметить как прочитанное"
                            >
                              ✓
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}