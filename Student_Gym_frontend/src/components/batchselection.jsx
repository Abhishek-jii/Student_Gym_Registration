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
    const [minDate, setMinDate] = useState('');

  
    useEffect(() => {
        const fetchBatches = async () => {
            const response = await axios.get('/api/getBatches');
            setBatches(response.data);
            console.log(batches)
        };
        fetchBatches();
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setMinDate(formattedDate);
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
              key: "rzp_test_wz5xalOCmIbO44", // Enter the Key ID generated from the Dashboard
              amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
              currency: "INR",
              name: "Gym", //your business name
              description: "work with us",
              order_id: order.id, //This is a sample Order ID. Pass the id obtained in the response of Step 1
        
              handler: async function (response) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
                  response;
                const payment_id = ${razorpay_order_id}|${razorpay_payment_id}|${razorpay_signature}
                try {
                  setToken(payment_id)
        
                  
                } catch (error) {
                  toast.error(error.response.data.message);
                }
                try {
                  const { data } = await axios.post(
                    '/api/createPayment/',
                    {
                        amount:1000,
                        batch_id:selectedBatch
                      ,payment_id
                    },
                  );
                   console.log("successful payment creation")
                    try {
                      const { data } = await axios.post(
                        '/api/createRegistration',
                        {
                          batch_id:selectedBatch,
                          month:month
                        }
                      )
                    } catch (error) {
                      
                    }
                } catch (err) {
                    alert('Error during batch selection');
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
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Select a Date</h2>
            <input type="date" name="month" id="month" onChange={(e) => setMonth(e.target.value)} required />
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
