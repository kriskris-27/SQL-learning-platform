import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import api from '../utils/api';

interface Assignment {
    _id: string;
    title: string;
    description: string;
    difficulty: string;
}

const AssignmentList: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await api.get('/assignments');
                setAssignments(response.data);
            } catch (error) {
                console.error('Error fetching assignments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    if (loading) return <div className="c-assignment-list__loading">Loading assignments...</div>;

    return (
        <section className="c-assignment-list">
            <h1 className="c-assignment-list__title">SQL Assignments</h1>
            <div className="c-assignment-list__grid">
                {assignments.map((assignment) => (
                    <div key={assignment._id} className="c-assignment-card">
                        <div className={`c-assignment-card__difficulty c-assignment-card__difficulty--${assignment.difficulty.toLowerCase()}`}>
                            {assignment.difficulty}
                        </div>
                        <h3 className="c-assignment-card__title">{assignment.title}</h3>
                        <p className="c-assignment-card__description">{assignment.description}</p>
                        <Link to={`/solve/${assignment._id}`} className="c-assignment-card__btn">
                            Solve Now <ChevronRight size={18} />
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default AssignmentList;
