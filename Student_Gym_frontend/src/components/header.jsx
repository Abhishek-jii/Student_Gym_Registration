import React from 'react';
import './Header.css';
import Logo from './Logo';

const Header = () => {
    return (
        <header className="header">
            <Logo />
            <nav className="nav">
                <a href="/">Home</a>
                <a href="/login">Login</a>
                <a href="/register">Register</a>
                <a href="/subscribe">Subscribe</a>
            </nav>
        </header>
    );
};

export default Header;
