import React, { useState } from 'react';
import axios from 'axios';

const Payment = () => {
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/pay', { amount });
            alert('Payment successful');
        } catch (err) {
            alert('Error during payment');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Make Payment</h2>
            <label>
                Amount:
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </label>
            <button type="submit">Pay</button>
        </form>
    );
};

export default Payment;
