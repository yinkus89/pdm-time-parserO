import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // Update the import to reference the global styles.css

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on submit
        setSuccessMessage(''); // Reset success message on submit
        try {
            const { data } = await axios.post('https://your-api-server.com/api/auth/login', { email, password });
            const token = data.token; // Adjust according to your API response structure
            localStorage.setItem('token', token);
            setSuccessMessage('Login successful! Redirecting to your profile...');
            setTimeout(() => {
                navigate(`/profile/${data.user.id}`);
            }, 2000); // Delay navigation to allow user to see success message
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h1>Login</h1>
            {error && <div className="error">{error}</div>}
            {successMessage && <div className="success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
};

export default Login;
