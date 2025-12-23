import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { getHomeData } from "../../api/homeApi";
import "./home.css";

export default function HomePage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeData()
      .then(setData)
      .catch((e) => console.error("HOME LOAD ERROR:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="homeWrap">
        <Sidebar />
        <div className="homeMain" style={{ padding: 40, fontSize: 22 }}>
          Загрузка...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="homeWrap">
        <Sidebar />
        <div className="homeMain" style={{ padding: 40, fontSize: 22 }}>
          Не удалось загрузить данные
        </div>
      </div>
    );
  }

  // пример: вытаскиваем блоки
  const { urgentTasks, bossMessages, labNotifications, currentUser } = data;
    return (
      <div className="homeWrap">
        <Sidebar />
    
        <div className="homeMain">
          {/* верхняя панель как в макете */}
          <header className="homeTopbar">
            <div className="homeTitle">главная</div>
    
            <div className="homeTopbarRight">
              <div className="topAvatar" />
              <div className="topBadge">
                <div className="topName">{currentUser?.name || "Пользователь"}</div>
                <div className="topRole">{currentUser?.role || "Сотрудник"}</div>
              </div>
            </div>
          </header>
    
          {/* именно ЭТА сетка должна совпадать с твоим home.css из макета */}
          <div className="homeGrid">
            {/* левый верхний большой блок */}
            <div className="card cardA">
              {/* если по макету это “статус/виджет” — оставь пустым или вставь что хочешь */}
            </div>
    
            {/* центр — сообщения от начальника */}
            <div className="card cardB">
              <div className="cardTitle">сообщения от начальника</div>
              <div className="cardBody">
                {(bossMessages || []).slice(0, 5).map((m) => (
                  <div className="lineItem" key={m.id}>
                    {m.text}
                  </div>
                ))}
              </div>
            </div>
    
            {/* левый нижний — срочные задачи */}
            <div className="card cardC">
              <div className="cardTitle">срочные задачи</div>
              <div className="cardBody">
                {(urgentTasks || []).slice(0, 6).map((t) => (
                  <div className="lineItem" key={t.id}>
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
    
            {/* правый — уведомления */}
            <div className="card cardD">
              <div className="cardTitle">уведомления от лаборатории</div>
              <div className="cardBody">
                {(labNotifications || []).slice(0, 6).map((n) => (
                  <div className="lineItem" key={n.id}>
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}