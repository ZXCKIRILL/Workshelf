import React, { useState, useEffect } from "react";
import Sidebar from "../HomePage/Sidebar";
import "./users.css";
import api from "../../api";

const avatarList = [
  "/avatar/user1.jpg",
  "/avatar/user2.jpg",
  "/avatar/user3.jpg",
  "/avatar/user4.jpg",
  "/avatar/user5.jpg",
  "/avatar/user6.jpg",
  "/avatar/user7.jpg",
];

export default function UsersPage() {
  const [avatar, setAvatar] = useState(avatarList[0]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [department, setDepartment] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTasks, setUserTasks] = useState([]);

  const userId = 1; // ID текущего пользователя

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Загружаем данные пользователя
        const userResponse = await api.get(`/users/${userId}`);
        setUser(userResponse.data);
        
        // Загружаем профиль пользователя
        const profileResponse = await api.get(`/userprofiles/${userId}`);
        setProfile(profileResponse.data);
        
        // Загружаем отдел, если есть departmentId
        if (profileResponse.data.departmentId) {
          const deptResponse = await api.get(`/departments/${profileResponse.data.departmentId}`);
          setDepartment(deptResponse.data);
        }
        
        // Загружаем задачи пользователя
        const tasksResponse = await api.get('/tasks');
        const userTasksData = tasksResponse.data.filter(task => 
          task.createdBy === userId || 
          (task.assignments && task.assignments.some(a => a.executorId === userId))
        );
        setUserTasks(userTasksData);
        
        // Загружаем все задачи для статистики
        setTasks(tasksResponse.data);
        
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Обновление профиля
  const updateProfile = async (updates) => {
    try {
      await api.put(`/userprofiles/${userId}`, {
        ...profile,
        ...updates
      });
      setProfile(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Ошибка обновления профиля:", error);
    }
  };

  // Обновление аватара
  const updateAvatar = async (newAvatar) => {
    try {
      setAvatar(newAvatar);
      await updateProfile({ avatarUrl: newAvatar });
      setPickerOpen(false);
    } catch (error) {
      console.error("Ошибка обновления аватара:", error);
    }
  };

  // Статистика по задачам пользователя
  const userStats = {
    totalTasks: userTasks.length,
    completedTasks: userTasks.filter(t => t.status === "Done").length,
    inProgressTasks: userTasks.filter(t => t.status === "InProgress").length,
    highPriorityTasks: userTasks.filter(t => t.priority >= 3).length,
  };

  if (loading) {
    return (
      <div className="usersWrap">
        <Sidebar />
        <div className="usersMain">
          <div className="loading">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="usersWrap">
      <Sidebar />

      <div className="usersMain">
        <header className="usersTopbar">
          <div className="usersTopbarLeft" />
          <div className="usersTopbarRight">
            <div className="topAvatar" />
            <div className="topBadge" />
          </div>
        </header>

        <div className="usersContent">
          <div className="usersGridTop">
            <div className="profileCard">
              <button
                type="button"
                className="avatarCircle"
                onClick={() => setPickerOpen(true)}
                title="Выбрать аватар"
              >
                <img src={profile?.avatarUrl || avatar} alt="avatar" />
              </button>

              <div className="fullName">
                <div>{user?.fullName || "Имя Фамилия"}</div>
                <div>{user?.role || "Роль"}</div>
              </div>
            </div>

            <div className="infoCard">
              <div className="infoTitle">личная информация</div>

              <div className="infoRow">
                <span className="infoLabel">Email</span>
                <span className="infoValue">{user?.email || "Не указан"}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Телефон</span>
                <span className="infoValue">{profile?.phone || "Не указан"}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Должность</span>
                <span className="infoValue">{profile?.position || "Не указана"}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Отдел</span>
                <span className="infoValue">{department?.name || "Не указан"}</span>
              </div>

              <div className="infoRow">
                <span className="infoLabel">Дата регистрации</span>
                <span className="infoValue">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : "Не указана"}
                </span>
              </div>
            </div>

            <div className="rightBigCard">
              <div className="statsTitle">Статистика задач</div>
              <div className="statsGrid">
                <div className="statItem">
                  <div className="statNumber">{userStats.totalTasks}</div>
                  <div className="statLabel">Всего задач</div>
                </div>
                <div className="statItem">
                  <div className="statNumber">{userStats.completedTasks}</div>
                  <div className="statLabel">Выполнено</div>
                </div>
                <div className="statItem">
                  <div className="statNumber">{userStats.inProgressTasks}</div>
                  <div className="statLabel">В работе</div>
                </div>
                <div className="statItem">
                  <div className="statNumber">{userStats.highPriorityTasks}</div>
                  <div className="statLabel">Высокий приоритет</div>
                </div>
              </div>
            </div>
          </div>

          <div className="usersGridBottom">
            <div className="bottomCard">
              <div className="cardTopLine">Последние задачи</div>
              <div className="tasksList">
                {userTasks.slice(0, 5).map(task => (
                  <div key={task.id} className="taskItem">
                    <div className="taskTitle">{task.title}</div>
                    <div className="taskMeta">
                      <span className={`priority priority-${task.priority}`}>
                        Приоритет: {task.priority}
                      </span>
                      <span className={`status status-${task.status}`}>
                        {task.status}
                      </span>
                      <span className="taskDate">
                        {new Date(task.endDate).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                ))}
                {userTasks.length === 0 && (
                  <div className="noTasks">Нет активных задач</div>
                )}
              </div>
            </div>

            <div className="bottomCard">
              <div className="cardTopLine short">Активность</div>
              <div className="activityList">
                {/* Здесь можно добавить логи активности из аудит логов */}
                <div className="activityItem">
                  <div className="activityTime">Сегодня, 10:30</div>
                  <div className="activityText">Создана новая задача "Отчет по продажам"</div>
                </div>
                <div className="activityItem">
                  <div className="activityTime">Вчера, 15:45</div>
                  <div className="activityText">Задача "Обновить документацию" выполнена</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {pickerOpen && (
          <div className="modalOverlay" onClick={() => setPickerOpen(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHead">
                <div className="modalTitle">Выбери аватар</div>
                <button className="xBtn" type="button" onClick={() => setPickerOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="avatarGrid">
                {avatarList.map((src) => (
                  <button
                    key={src}
                    type="button"
                    className={`avatarPick ${src === avatar ? "active" : ""}`}
                    onClick={() => updateAvatar(src)}
                  >
                    <img src={src} alt="pick" />
                  </button>
                ))}
              </div>

              <div className="modalHint">
                Папка: <b>public/avatars</b> (добавляй свои картинки туда)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}