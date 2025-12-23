import React from "react";
import Sidebar from "../HomePage/Sidebar";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="appLayout">
      <Sidebar />
      <div className="appPage">{children}</div>
    </div>
  );
}
