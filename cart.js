import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import
import './Cart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Import specific icon

function Cart() {
    const [items, setItems] = useState([]);
    const [detailedItems, setDetailedItems] = useState([]);
    const [username, setUsername] = useState('');
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token); // Decode token here
                setUsername(decodedToken.name);
            } catch (error) {
                console.error('Error decoding token:', error);
                return; // Exit if token decoding fails
            }

            fetch('http://localhost:8080/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: username })
            })
                .then(response => {
                    if (!response.ok) {
                        return response.text().then(text => { throw new Error(text) });
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Data fetched:', data);
                    setItems(Array.isArray(data) ? data : []);
                    
                    const itemIds = data.map(item => item.itemId);
                    if (itemIds.length > 0) {
                        fetch('http://localhost:8080/itemdatas', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ itemIds })
                        })
                            .then(response => {
                                if (!response.ok) {
                                    return response.text().then(text => { throw new Error(text) });
                                }
                                return response.json();
                            })
                            .then(details => {
                                console.log('Item details fetched:', details);
                                setDetailedItems(details);
                            })
                            .catch(error => console.error('Error fetching item details:', error));
                    }
                })
                .catch(error => console.error('Error fetching cart data:', error));
        }
    }, [token, username]);

    const combinedItems = items.map(item => {
        const detailedItem = detailedItems.find(detail => detail._id === item.itemId);
        return {
            ...item,
            ...detailedItem
        };
    });

    const totalAmount = combinedItems.reduce((total, item) => total + item.Price * item.count, 0);
    const itemsCount = combinedItems.reduce((count, item) => count + item.count, 0);

    const handleDelete = (itemId) => {
        fetch('http://localhost:8080/deleteitem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ itemId })  // Pass itemId correctly
        }).then(response => {
            if (response.ok) {
                setItems(items.filter(item => item.itemId !== itemId));
            } else {
                console.error('Failed to delete item');
            }
        });
    };

    return (
        <div className='cartdata'>
            <h1>Items in cart:</h1>
            {token ? (
                combinedItems.length === 0 ? (
                    <p>No items available</p>
                ) : (
                    <div>
                        <div className="items-container">
                            {combinedItems.map((item) => (
                                <div className="cartitems" key={item._id}>
                                    <img src={`assest/${item.image}`} alt={item.itemname} />
                                    <div className='specify'>
                                        <p>
                                            {item.specification} / {item.rating}
                                            <img src={'assest/star.png'} className='rates' alt='ratings' /> / 
                                            <span style={{ fontWeight: 'bold', color: 'green', fontSize: '1.5em' }}> ₹{item.Price}</span>
                                        </p>
                                        <p>
                                            Amount: {item.amount} / Count: {item.count}
                                        </p>
                                    </div>
                                    <button className='cartbutton'>CheckOut</button>
                                    <FontAwesomeIcon icon={faTrash} onClick={() => handleDelete(item.itemId)} className="delete-icon"/>
                                </div>
                            ))}
                        </div>
                        <div className="totals">
                            <p>Total Amount: ₹{totalAmount}</p>
                            <p>Total Items: {itemsCount}</p>
                            <button className='cartbutton'>Proceed to Buy</button>
                        </div>
                    </div>
                )
            ) : (
                <p>You need to login first</p>
            )}
        </div>
    );
}

export default Cart;
