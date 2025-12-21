import { useLocation, useNavigate } from "react-router-dom";
import usersIcon from "../../assets/icons/users.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import docsIcon from "../../assets/icons/documents.svg";
import chatIcon from "../../assets/icons/chat.svg";


const items = [
  { id: "users", icon: usersIcon, label: "Сотрудники", to: "/users" },
  { id: "calendar", icon: calendarIcon, label: "Календарь", to: "/calendar" },
  { id: "docs", icon: docsIcon, label: "Документы", to: "/docs" },
  { id: "chat", icon: chatIcon, label: "Чат", to: "/chat" },
];
export default function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="sidebar">
      <div className="sbTopSpacer" />
      <div className="sbDivider" />

      <div className="sbList">
        {items.map((item) => {
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
      </div>
    </aside>
  );
}