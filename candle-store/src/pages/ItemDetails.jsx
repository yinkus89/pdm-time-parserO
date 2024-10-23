import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/items/${id}`)
            .then(response => response.json())
            .then(data => setItem(data))
            .catch(error => console.error('Error fetching item:', error));
    }, [id]);

    if (!item) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{item.name}</h1>
            <p>{item.description}</p>
            <p>Price: ${item.price}</p>
            <img src={item.image} alt={item.name} />
        </div>
    );
};

export default ItemDetails;
