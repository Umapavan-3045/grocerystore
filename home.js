import React, { useState, useEffect } from 'react';
import './home.css';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwtDecode
import Popup from './popup';

function Home() {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [balance, setBalance] = useState(0);
    const [due, setDue] = useState(0);
    const [allItems, setAllItems] = useState([]); // To store all fetched items

    const togglePopup = (item) => {
        setSelectedItem(item);
        setShowPopup(!showPopup);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/home');
                const data = await response.json();
                setItems(data);
                setAllItems(data); // Store all items
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken.loginType === "customer") {
                    setBalance(decodedToken.walletBalance);
                    setDue(decodedToken.payDue);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value === '') {
            setItems(allItems); // Use allItems when searchTerm is empty
        } else {
            const filteredItems = allItems.filter(item =>
                item.itemname.toLowerCase().includes(value.toLowerCase()) ||
                item.specification.toLowerCase().includes(value.toLowerCase())
            );
            setItems(filteredItems);
        }
    };

    const token = localStorage.getItem('token');
    let loginType = '';
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            loginType = decodedToken.loginType || '';
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    return (
        <div className='group'>
            <div className='details'>
                <div className='search-bar'>
                    <input
                        type='text'
                        className='search-input'
                        placeholder='Search items...'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button className='search-button' onClick={handleSearch}>Search</button>
                </div>
                {loginType === "customer" && (
                    <div>
                        <div className='containers'>
                            <img src={`assest/wallet.png`} alt="Balance" className='icons' />
                            <p>Wallet Balance : <br />{balance}</p>
                        </div>
                        <div className='containers'>
                            <img src={`assest/pay.png`} alt="Due" className='icons' />
                            <p>Pay Due : <br />{due}</p>
                        </div>
                    </div>
                )}
            </div>
            <p className='headings'>List of Items</p>
            <div className='itemdata'>
                {items.length === 0 ? (
                    <p>No items available</p>
                ) : (
                    items.map((item) => (
                        <div className="items" key={item._id}>
                            <img src={`assest/${item.image}`} alt={item.itemname} />
                            <div>
                                <p>
                                    {item.itemname} / {item.specification} / {item.rating}
                                    <img src={'assest/star.png'} className='rate' alt='rating' />
                                    <span style={{ fontWeight: 'bold', color: 'green', fontSize: '1.5em' }}> ₹{item.Price}</span>
                                </p>
                            </div>
                            <button className='cart' onClick={() => togglePopup(item)}>Add to Cart</button>
                        </div>
                    ))
                )}
            </div>
            <Popup show={showPopup} onClose={() => setShowPopup(false)} item={selectedItem} />
        </div>
    );
}

export default Home;
