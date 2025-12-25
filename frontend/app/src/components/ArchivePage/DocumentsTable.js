import React, { useEffect, useState } from "react";
import { get } from "../../api/http";
import "./archive.css";

export default function DocumentsTable({ documents: propDocuments = [] }) { 
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        get("/api/documents") 
            .then(data => {
                setDocuments(data.documents || []); 
                setLoading(false);
            })
            .catch(error => {
                console.error("Ошибка загрузки документов:", error);
                setDocuments([]);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="docsZone">Загрузка...</div>;
    }

    return (
        <div className="docsZone">
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
