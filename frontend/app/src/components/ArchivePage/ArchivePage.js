import React from "react";
import Sidebar from "../HomePage/Sidebar";
import DocumentsTable from "./DocumentsTable";
import "./archive.css";

export default function DocsPage() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* ВОТ ЗДЕСЬ SIDEBAR */}
      <Sidebar />

      {/* ВОТ ЗДЕСЬ КОНТЕНТ */}
      <div style={{ flex: 1, padding: 20 }}>
        <DocumentsTable documents={[]} />
      </div>
    </div>
  );
}
