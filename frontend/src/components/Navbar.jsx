import styles from './Navbar.module.css';

const placeHolderLogo = "https://png.pngtree.com/png-clipart/20230813/original/pngtree-circular-avatar-vector-illustration-male-businesswoman-human-businessman-vector-picture-image_10581231.png";

const Navbar = () => {
    return (
        // Use curly braces to access the styles object
        <nav className={styles.navbar}>
            {/* Use bracket notation ['...'] for classes with dashes */}
            <div className={styles['nav-name']}>
                <h2>InternTrack</h2>
            </div>
            <div className={styles['placeholder-img']}>
                <img src={placeHolderLogo} alt="user profile" className={styles.avatar} />
            </div>
        </nav>
    );
};

export default Navbar;