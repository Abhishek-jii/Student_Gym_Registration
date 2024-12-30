import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { data, useNavigate } from "react-router-dom";
import { UserData } from './context.jsx';

const BatchSelection = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [month ,setMonth] = useState('');
      const navigate = useNavigate();
    const { isAuth, setToken} = UserData()
    useEffect(() => {
        const fetchBatches = async () => {
            const response = await axios.get('/api/getBatches');
            setBatches(response.data);
            console.log(batches)
        };
        fetchBatches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!isAuth) alert("Plz Login")
        const {
              data: { order },
            } = await axios.post(
              `/api/checkout/`,
            );
            console.log(order)
         const options = {
              key: "<seceret_key>", // Enter the Key ID generated from the Dashboard of RazorPay API Keys
              amount: order.amount, 
              currency: "INR",
              name: "Gym Registration", 
              description: "work with us",
              order_id: order.id, 
        
              handler: async function (response) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
                  response;
                const payment_id = `${razorpay_order_id}|${razorpay_payment_id}|${razorpay_signature}`
                try {
                  setToken(payment_id)
        
                  
                } catch (error) {
                  toast.error(error.response.data.message);
                }
                alert("registered for the batch")
              },
              theme: {
                color: "#8a4baf",
              },
            };
            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", function (response) {
              console.error("Payment Failed:", response.error);
            });
            razorpay.open();
        try {
          const { data } = await axios.post(
            'http://localhost:3000/api/createPayment/',
            {
                amount:1000,
                batch_id:selectedBatch,
                month: '2024-12-30'
              ,payment_id
            },
          );
           
            alert('Batch selected successfully');
        } catch (err) {
            alert('Error during batch selection');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Select a Batch</h2>
            <select onChange={(e) => setSelectedBatch(e.target.value)} required>
                <option value="">-- Select a Batch --</option>
                {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                        {batch.batch_name} ({batch.timing})
                    </option>
                ))}
            </select>
            <button type="submit">Submit</button>
        </form>
    );
};

export default BatchSelection;
