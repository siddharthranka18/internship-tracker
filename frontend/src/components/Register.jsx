import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import styles from './Auth.module.css'; // You can create this for styling

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/register', formData);
            alert("Registration Successful!");
            navigate('/login'); // Move to login after signing up
        } catch (err) {
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    return (
        <div className={styles.authContainer}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} required />
                <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;