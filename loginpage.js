import React, { useState } from 'react';
import "./login.css";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [type, setType] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [usertype, setUsertype] = useState('customer');
    const navigate = useNavigate();

    const toggleForm = (formType) => {
        setType(formType);
    };

    const handleSelect = (e) => {
        setUsertype(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ loginType: usertype, name: username, password }),
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                console.error('Login failed', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };    

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: username, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Signup successful', data);
                alert("Welcome to my grocery, happy shopping!");
                localStorage.setItem('token', data.token);
                toggleForm('login');
            } else {
                console.error('Signup failed', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="container">
            {type === "login" && (
                <div className="inputform">
                    <h1>Login</h1>
                    <form onSubmit={handleLogin}>
                        <label>Login Type :</label>
                        <select onChange={handleSelect} value={usertype}>
                            <option value="admin">Admin</option>
                            <option value="customer">Customer</option>
                        </select>
                            <div>
                                <div className='input_box'>
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className='input_box'>
                                    <input
                                        type="password"
                                        id="password"
                                        placeholder="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        <button type="submit" className="btn">Login</button>
                        <p>Don't have an account? <p onClick={() => toggleForm('SignUp')}>SignUp</p></p>
                    </form>
                </div>
            )}
            {type === "SignUp" && (
                <div className="inputform">
                    <h1>SignUp</h1>
                    <form onSubmit={handleSignup}>
                        <div className='input_box'>
                            <input
                                type="text"
                                id="username"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input_box'>
                            <input
                                type="text"
                                id="emailid"
                                placeholder="EmailId"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className='input_box'>
                            <input
                                type="password"
                                id="password"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn">SignUp</button>
                        <p>Already a member? <p onClick={() => toggleForm('login')}>Login</p></p>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Login;