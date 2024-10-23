import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Chat from './components/Chat';
import UploadStatus from './components/UploadStatus';

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Header /> {/* Include Header here */}
                <div className="app-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile/:id" element={<Profile />} />
                        <Route path="/chat" element={<Chat />} />
                        <Route path="/status/upload" element={<UploadStatus />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
                <Footer /> {/* Include Footer here */}
            </AuthProvider>
        </Router>
    );
};

export default App;

