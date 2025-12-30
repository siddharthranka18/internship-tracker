import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../context/AuthContext'; // Access the global auth state
import api from '../api'; // Ensure axios instance is imported

const placeHolderLogo = "https://png.pngtree.com/png-clipart/20230813/original/pngtree-circular-avatar-vector-illustration-male-businesswoman-human-businessman-vector-picture-image_10581231.png";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); // Pull user status and setter

    const handleLogout = async () => {
        try {
            // 1. Tell backend to clear the cookie
            await api.get('/logout'); 
            
            // 2. Clear local storage
            localStorage.removeItem('user'); 
            
            // 3. Clear global React state so UI updates immediately
            setUser(null); 
            
            // 4. Redirect
            navigate('/login'); 
        } catch (err) {
            console.error("Logout failed:", err);
            // Fallback: Clear state and redirect even if server is down
            setUser(null);
            navigate('/login');
        }
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles['nav-name']}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2>InternTrack</h2>
                </Link>
            </div>

            <div className={styles['nav-right']}>
                {/* CONDITIONAL RENDERING: Logic starts here */}
                {!user ? (
                    <>
                        {/* Shown only when NOT logged in */}
                        <Link to="/login" className={styles['nav-link']}>Login</Link>
                        <Link to="/register" className={styles['nav-btn']}>Register</Link>
                    </>
                ) : (
                    <>
                        {/* Shown only when logged in */}
                        <span className={styles.welcomeText}>Hello, {user.username || 'User'}</span>
                        <button onClick={handleLogout} className={styles['logout-btn']}>
                            Logout
                        </button>
                        <div className={styles['placeholder-img']}>
                            <img src={placeHolderLogo} alt="user profile" className={styles.avatar} />
                        </div>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;