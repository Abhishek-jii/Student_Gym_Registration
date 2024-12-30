import React, { useState } from 'react';
import axios from 'axios';
import './Subscribe.css';

const GetSubscription = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    batch: '',
    paymentAmount: 1000,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/getsubscription', formData);
      alert('Subscription successful!');
    } catch (err) {
      alert('Error during subscription. Please try again.');
    }
  };

  return (
    <div className="subscription-container">
      <div className="subscription-box">
        <form onSubmit={handleSubmit}>
          <h2>Get Subscription</h2>
          <div className="form-group">
            <label>
              Select Batch:
              <select name="batch" value={formData.batch} onChange={handleChange} required>
                <option value="">Select a batch</option>
                <option value="morning">Morning (6 AM - 7 AM)</option>
                <option value="afternoon">Afternoon (12 PM - 1 PM)</option>
                <option value="evening">Evening (5 PM - 6 PM)</option>
              </select>
            </label>
          </div>
          <div className="form-group">
            <label>
              Payment Amount:
              <input
                type="number"
                name="paymentAmount"
                value={formData.paymentAmount}
                readOnly
              />
            </label>
          </div>
          <button type="submit" className="submit-btn">Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default GetSubscription;
