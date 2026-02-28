import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { Play, Lightbulb } from 'lucide-react';
import SchemaViewer from './SchemaViewer';
import ResultTable from './ResultTable';

const SolveAssignment: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<any>(null);
    const [sqlQuery, setSqlQuery] = useState('SELECT * FROM employees;');
    const [results, setResults] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hint, setHint] = useState<string | null>(null);
    const [rowCount, setRowCount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/assignments/${id}`);
                setAssignment(response.data);
            } catch (err) {
                console.error('Error fetching assignment:', err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchAssignment();
    }, [id, navigate]);

    const handleRunQuery = async () => {
        setRunning(true);
        setError(null);
        setResults(null);
        setRowCount(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/execute',
                { assignmentId: id, sqlQuery },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResults(response.data.data);
            setRowCount(response.data.rowCount);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error executing query');
        } finally {
            setRunning(false);
        }
    };

    const handleGetHint = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/hint',
                { assignmentId: id, userQuery: sqlQuery },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHint(response.data.hint);
        } catch (err) {
            console.error('Error getting hint:', err);
        }
    };

    if (loading) return <div className="c-solver__loading">Loading assignment...</div>;

    // Transform server tableMetadata to SchemaViewer format
    const tablesInfo = assignment?.tableMetadata?.map((table: any) => {
        // Extract column names from createTableQuery if sampleData columns aren't explicit
        // For simplicity, we'll try to get them from the first sampleData row
        const firstRow = table.sampleData[0] || {};
        return {
            tableName: table.tableName,
            columns: Object.keys(firstRow).map(name => ({
                name,
                type: typeof firstRow[name] === 'number' ? 'INTEGER' : 'TEXT'
            }))
        };
    }) || [];

    return (
        <div className="c-solver">
            <aside className="c-solver__sidebar">
                <div className="c-solver__card">
                    <h1 className="c-solver__title">{assignment.title}</h1>
                    <div className={`c-assignment-card__difficulty c-assignment-card__difficulty--${assignment.difficulty.toLowerCase()}`}>
                        {assignment.difficulty}
                    </div>
                    <p className="c-solver__description">{assignment.description}</p>
                    <div className="c-solver__question">
                        {assignment.question}
                    </div>
                </div>

                <SchemaViewer tables={tablesInfo} />
            </aside>

            <main className="c-solver__main">
                <div className="c-solver__card">
                    <div className="c-solver__editor-container">
                        <Editor
                            height="100%"
                            defaultLanguage="sql"
                            theme="vs-dark"
                            value={sqlQuery}
                            onChange={(value) => setSqlQuery(value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    <div className="c-solver__actions">
                        <button
                            className="c-solver__btn c-solver__btn--hint"
                            onClick={handleGetHint}
                        >
                            <Lightbulb size={20} />
                            Get Hint
                        </button>
                        <button
                            className="c-solver__btn c-solver__btn--run"
                            onClick={handleRunQuery}
                            disabled={running}
                        >
                            {running ? 'Running...' : <><Play size={20} /> Run Query</>}
                        </button>
                    </div>

                    {hint && (
                        <div className="c-solver__hint-box">
                            <Lightbulb size={18} />
                            <div>
                                <strong>Tutor's Hint:</strong>
                                <p>{hint}</p>
                            </div>
                        </div>
                    )}
                </div>

                <ResultTable results={results} error={error} rowCount={rowCount} />
            </main>
        </div>
    );
};

export default SolveAssignment;
