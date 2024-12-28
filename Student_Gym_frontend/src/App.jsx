import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import BatchSelection from './components/batchselection';
import Payment from './components/payment';
import Dashboard from './components/dashboard';
import Header from './components/header';
import Footer from './components/footer';
import Home from './components/home';
import './App.css';


const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} /> 
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/batch-selection" element={<BatchSelection />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <Footer />
        </>       
    );
};

export default App;
