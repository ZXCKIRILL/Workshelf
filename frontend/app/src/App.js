import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import CalendarPage from "./components/CalendarPage/CalendarPage";
import UsersPage from "./components/UsersPage/UsersPage";
import DocsPage from "./components/ArchivePage/DocumentsTable";

function Stub({ title }) {
  return <div style={{ padding: 40, fontSize: 28 }}>{title}</div>;
}
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/chat" element={<Stub title="Чат" />} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
