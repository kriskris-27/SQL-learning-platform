import React from 'react';
import { AlertCircle, Download } from 'lucide-react';

interface ResultTableProps {
    results: any[] | null;
    error: string | null;
    rowCount: number | null;
}

const ResultTable: React.FC<ResultTableProps> = ({ results, error, rowCount }) => {
    if (error) {
        return (
            <div className="c-results c-solver__card">
                <div className="c-results__title">
                    <span>Execution Error</span>
                    <AlertCircle size={18} color="#ef4444" />
                </div>
                <div className="c-results__error">{error}</div>
            </div>
        );
    }

    if (!results || results.length === 0) {
        return (
            <div className="c-results c-solver__card">
                <div className="c-results__title">
                    <span>Query Results</span>
                </div>
                <div className="c-results__empty">
                    {rowCount === 0 ? 'Query successful, but no rows returned.' : 'Run a query to see results here.'}
                </div>
            </div>
        );
    }

    const columns = Object.keys(results[0]);

    return (
        <div className="c-results c-solver__card">
            <div className="c-results__title">
                <span>Query Results ({rowCount} rows)</span>
                <button className="c-results__download" title="Export to CSV">
                    <Download size={18} />
                </button>
            </div>
            <div className="c-results__table-container">
                <table className="c-results__table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((row, idx) => (
                            <tr key={idx}>
                                {columns.map((col) => (
                                    <td key={col}>{row[col]?.toString() ?? 'NULL'}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ResultTable;
