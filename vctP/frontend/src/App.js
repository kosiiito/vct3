// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Auth from './Auth';
import api from './api';

function App() {
    const [data, setData] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.get('/data');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await api.put('/data');
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    return (
        <div className="App">
            <h1>Hello World from Frontend!</h1>
            <Auth />
            <div>
                <h2>Data from Backend:</h2>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                <button onClick={handleUpdate}>Update Data</button>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}

export default App;
