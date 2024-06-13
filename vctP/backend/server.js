const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 5000;

let dataStore = [];

const secretKey = 'vctp';

app.use(express.json());

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); 
        }
        req.user = user;
        next();
    });
};

app.post('/register', (req, res) => {
    const { username, password } = req.body;


    res.json({ message: 'User registered successfully!' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const response = await axios.post('http://keycloak:8080/auth/realms/your-realm/protocol/openid-connect/token', {
            grant_type: 'password',
            client_id: 'your-client-id',
            client_secret: 'your-client-secret',
            username,
            password,
        });

        const token = response.data.access_token;
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error.response.data.error_description);
        res.status(401).json({ error: 'Authentication failed' });
    }
});

app.get('/data', verifyToken, (req, res) => {
    res.json({ message: 'GET request successful!', data: dataStore, user: req.user });
});

app.put('/data', verifyToken, (req, res) => {
    const newData = req.body;
    dataStore.push(newData);
    res.json({ message: 'PUT request successful!', data: dataStore, user: req.user });
});

app.listen(port, () => {
    console.log(`Backend app listening at http://localhost:${port}`);
});
