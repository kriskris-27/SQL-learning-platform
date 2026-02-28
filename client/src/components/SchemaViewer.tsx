import React from 'react';
import { Table, ChevronDown } from 'lucide-react';

interface Column {
    name: string;
    type: string;
}

interface TableInfo {
    tableName: string;
    columns: Column[];
}

interface SchemaViewerProps {
    tables: TableInfo[];
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ tables }) => {
    return (
        <div className="c-schema c-solver__card">
            <h3 className="c-schema__title">
                <Table size={20} />
                Database Schema
            </h3>
            {tables.map((table) => (
                <div key={table.tableName} className="c-schema__table">
                    <div className="c-schema__table-name">
                        {table.tableName}
                        <ChevronDown size={14} />
                    </div>
                    <div className="c-schema__columns">
                        {table.columns.map((col) => (
                            <div key={col.name} className="c-schema__column">
                                <span className="c-schema__column-name">{col.name}</span>
                                <span className="c-schema__column-type">{col.type}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SchemaViewer;
