import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <main className="home">
            <section className="hero">
                <h1>Welcome to the Gym Registration System</h1>
                <p>Your fitness journey starts here. Register now to join a batch!</p>
                <a href="/register" className="btn">Get Started</a>
            </section>
        </main>
    );
};

export default Home;
