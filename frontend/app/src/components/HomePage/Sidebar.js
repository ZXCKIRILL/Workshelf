// Sidebar.js
import { useLocation, useNavigate } from "react-router-dom";
import usersIcon from "../../assets/icons/user.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import docsIcon from "../../assets/icons/documents.svg";
import chatIcon from "../../assets/icons/chat.svg";


const items = [
  { id: "user", icon: usersIcon, label: "Сотрудники", to: "/user" },
  { id: "calendar", icon: calendarIcon, label: "Календарь", to: "/calendar" },
  { id: "docs", icon: docsIcon, label: "Документы", to: "/docs" },
  { id: "chat", icon: chatIcon, label: "Чат", to: "/chat" },
];
export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
<<<<<<< Updated upstream
      <div className="sbTopSpacer" />
      <div className="sbDivider" />

      <div className="sbList">
        {items.map((item) => {
=======
      <div className="sbTop" />
      <nav className="sbList">
        {items.map(item => {
>>>>>>> Stashed changes
          const active = pathname.startsWith(item.to);

          return (
            <button
              key={item.id}
              type="button"
              className={`sbItem ${active ? "active" : ""}`}
              title={item.label}
              onClick={() => navigate(item.to)}
            >
              <img src={item.icon} alt={item.label} />
            </button>
          );
        })}
<<<<<<< Updated upstream
=======
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
>>>>>>> Stashed changes
      </div>
    </aside>
  );
}