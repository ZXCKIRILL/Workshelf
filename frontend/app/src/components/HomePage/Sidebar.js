import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";

import userIcon from "../../assets/icons/user.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import docsIcon from "../../assets/icons/documents.svg";
import chatIcon from "../../assets/icons/chat.svg";

const items = [
  { id: "user", icon: userIcon, label: "Сотрудники", to: "/users" },
  { id: "calendar", icon: calendarIcon, label: "Календарь", to: "/calendar" },
  { id: "docs", icon: docsIcon, label: "Документы", to: "/docs" },
  { id: "chat", icon: chatIcon, label: "Чат", to: "/chat" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const userId = localStorage.getItem("userId") || 1;
        const response = await api.get(`/notifications/user/${userId}`);
        const unread = response.data.filter(n => !n.isRead).length;
        setUnreadCount(unread);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnreadNotifications();
    const i = setInterval(fetchUnreadNotifications, 30000);
    return () => clearInterval(i);
  }, []);

  const handleNavigation = async (to, label) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      await api.post("/auditlogs", {
        userId: +userId,
        action: "Navigate",
        entityType: "Page",
        entityId: to,
        details: `Navigated to ${label}`,
        timestamp: new Date().toISOString(),
      });
    }
    navigate(to);
  };

  return (
    <aside className="sidebar">
      <div className="sbTop" />

      <nav className="sbList">
        {items.map(item => {
          const active = pathname.startsWith(item.to);

          return (
            <button
              key={item.id}
              className={`sbItem ${active ? "active" : ""}`}
              title={item.label}
              onClick={() => handleNavigation(item.to, item.label)}
            >
              <img src={item.icon} alt={item.label} />
              {item.id === "chat" && unreadCount > 0 && (
                <span className="sbBadge">{unreadCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sbBottom">
        <button
          className="sbLogout"
          onClick={async () => {
            const userId = localStorage.getItem("userId");
            if (userId) {
              await api.post("/auditlogs", {
                userId: +userId,
                action: "Logout",
                entityType: "User",
                entityId: userId,
                details: "User logged out",
                timestamp: new Date().toISOString(),
              });
            }
            localStorage.clear();
            navigate("/login");
          }}
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}
