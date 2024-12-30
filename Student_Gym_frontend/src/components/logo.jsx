import React from 'react';
import './Logo.css';
import { Link } from 'react-router-dom';


const Logo = () => {
    return (
        <div className="logo">
        <Link to="/">
            <img src="/logoPhoto.png" alt="Gym Logo" />
            <h1>Gym Vym</h1>
        </Link>
        </div>
    );
};

export default Logo;
