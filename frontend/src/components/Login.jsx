import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import
import api from '../api';
import styles from './Auth.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useAuth(); // 2. Destructure setUser
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/login', { email, password });
            
            if (response.status === 200) {
                // 3. Update the global auth state with the user data
                setUser(response.data.user); 
                
                // 4. Redirect to Dashboard
                navigate('/'); 
            }
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    // src/components/Login.jsx
    return (
        <div className={styles.authContainer}> {/* Match the class from auth.module.css */}
            <div className={styles.authCard}>
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className={styles.authForm}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className={styles.authInput}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className={styles.authInput}
                        required 
                    />
                    <button type="submit" className={styles.authBtn}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Login;