import React from "react";
import Sidebar from "../HomePage/Sidebar";
import DocumentsTable from "./DocumentsTable";
import "./archive.css";

export default function DocsPage() {
    return (
        <div className="archiveWrap"> {}
            {}
            <Sidebar />
            {}
            <div className="archiveRight"> {}
                <div className="docsZone"> {}
                    <DocumentsTable /> {}
                </div>
            </div>
        </div>
    );
}