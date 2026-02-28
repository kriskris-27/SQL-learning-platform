import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(response.data.token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="c-auth-form">
            <h2 className="c-auth-form__title">Login to CipherSQL</h2>
            {error && <p className="c-auth-form__error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="c-auth-form__field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="c-auth-form__field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="c-auth-form__btn">Login</button>
            </form>
            <p className="c-auth-form__footer">Don't have an account? <Link to="/register">Register</Link></p>
        </div>
    );
};

export default Login;
