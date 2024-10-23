// src/components/Candle.jsx
import React from 'react';
import './app.css'; // Import styles

const Candle = ({ candle }) => {
    return (
        <div className="candle-card">
            <img src={candle.image} alt={candle.name} className="candle-image" />
            <h3 className="candle-name">{candle.name}</h3>
            <p className="candle-description">{candle.description}</p>
            <p className="candle-price">${candle.price}</p>
            <button className="delete-button">Delete</button>
        </div>
    );
};

export default Candle;
