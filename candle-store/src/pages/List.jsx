import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const List = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Fetch the items from the API
        fetch('http://localhost:3000/items')
            .then(response => response.json())
            .then(data => setItems(data))
            .catch(error => console.error('Error fetching items:', error));
    }, []);

    return (
        <div>
            <h1>Item List</h1>
            <ul>
                {items.map(item => (
                    <li key={item.id}>
                        <h2>{item.name}</h2>
                        <p>{item.description}</p>
                        <p>Price: ${item.price}</p>
                        <img src={item.image} alt={item.name} style={{ width: '100px' }} />
                        <div>
                            <Link to={`/item/${item.id}`}>View Details</Link> | 
                            <Link to={`/update/${item.id}`}> Update</Link>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default List;
