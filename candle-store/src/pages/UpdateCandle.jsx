import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const UpdateCandle = () => {
    const { id } = useParams();
    const history = useHistory();
    const [item, setItem] = useState({
        name: '',
        description: '',
        price: '',
        image: ''
    });

    useEffect(() => {
        // Fetch the item to be updated
        fetch(`http://localhost:3000/items/${id}`)
            .then(response => response.json())
            .then(data => setItem(data))
            .catch(error => console.error('Error fetching item:', error));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setItem(prevItem => ({
            ...prevItem,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Update the item on the server
        fetch(`http://localhost:3000/items/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
            .then(response => response.json())
            .then(data => {
                console.log('Item updated:', data);
                history.push('/items'); // Redirect to items list after update
            })
            .catch(error => console.error('Error updating item:', error));
    };

    return (
        <div>
            <h1>Update Candle</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={item.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={item.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={item.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="image">Image URL:</label>
                    <input
                        type="text"
                        id="image"
                        name="image"
                        value={item.image}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Update Candle</button>
            </form>
        </div>
    );
};

export default UpdateCandle;
