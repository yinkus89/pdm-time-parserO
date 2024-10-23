import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/styles.css'; // Ensure you reference the global styles.css

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset error message on submit
        setSuccessMessage(''); // Reset success message on submit

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        try {
            const { data } = await axios.post('https://your-api-server.com/api/auth/register', { email, password });
            // Assuming the response contains some useful information about the registered user
            console.log(data); // For debugging: Log the response data
            setSuccessMessage('Registration successful! You can now log in.');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // Delay navigation to allow user to see success message
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="form-container">
            <h1>Register</h1>
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
                <div>
                    <label>Confirm Password</label>
                    <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
};

export default Register;
