import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { UserData } from './context';

const BatchSelection = () => {
    const [batches, setBatches] = useState([]);
    const [selectedBatch, setSelectedBatch] = useState('');
    const [month ,setMonth] = useState('');
      const navigate = useNavigate();
    const { user, isAuth} = UserData()
    useEffect(() => {
        const fetchBatches = async () => {
            const response = await axios.get('/api/getBatches');
            setBatches(response.data);
        };
        fetchBatches();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!isAuth) alert("Plz Login")
        const {
              data: { order },
            } = await axios.post(
              `${server}/api/checkout/`,
            );
         const options = {
              key: "rzp_test_yOMeMyaj2wlvTt", // Enter the Key ID generated from the Dashboard
              amount: order.id, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
              currency: "INR",
              name: "E learning", //your business name
              description: "Learn with us",
              order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        
              handler: async function (response) {
                const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
                  response;
                const payment_id = `${razorpay_order_id}|${razorpay_payment_id}|${razorpay_signature}`
                try {
                  const { data } = await axios.post(
                    `${server}/api/createPayment/`,
                    {studend_id:user.usn,
                        amount:1000,
                        batch_id:selectedBatch,
                        month: month
                      ,payment_id
                    },
                  );
        
                  
                } catch (error) {
                  toast.error(error.response.data.message);
                  setLoading(false);
                }
                alert("registered for the batch")
              },
              theme: {
                color: "#8a4baf",
              },
            };
            const razorpay = new window.Razorpay(options);
        
            razorpay.open();
        try {
            await axios.post('/api/register-batch', { ...user,batch_name });
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
