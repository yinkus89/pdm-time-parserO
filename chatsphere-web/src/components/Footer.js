import React from 'react';
import '../styles/styles.css'; // Ensure styles are imported

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} ChatSphere. All rights reserved.</p>
                <p>
                    <a href="/about">About Us</a> | 
                    <a href="/contact">Contact</a> | 
                    <a href="/privacy">Privacy Policy</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
