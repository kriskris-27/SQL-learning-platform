import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AssignmentList from './components/AssignmentList';
import Login from './components/Login';
import Register from './components/Register';
import SolveAssignment from './components/SolveAssignment';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<AssignmentList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/progress" element={<div>Progress Page (Coming Soon)</div>} />
                    <Route path="/solve/:id" element={<SolveAssignment />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
