import React from "react";
import "./archive.css";

export default function DocumentsTable({ documents = [] }) {
  return (
    <div className="docsZone">
      {/* Если пока пусто */}
      {documents.length === 0 ? (
        <div className="docsEmpty">Тут размещаются файлы</div>
      ) : (
        <div className="docsList">
          {documents.map((d) => (
            <div className="docsRowSimple" key={d.id}>
              <div className="docsTitle">{d.title}</div>
              <div className="docsMeta">{d.fileName}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
