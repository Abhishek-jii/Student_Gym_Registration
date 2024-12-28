import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get('/api/unpaid-students');
            setStudents(response.data);
        };
        fetchStudents();
    }, []);

    return (
        <div>
            <h2>Admin Dashboard</h2>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        {student.name} - Outstanding Dues: ${student.dues}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
