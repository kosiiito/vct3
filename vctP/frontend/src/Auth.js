const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 5000;

// Примерна база данни (може да се замени с реална база данни като MySQL или MongoDB)
let dataStore = [];

// Примерен секретен ключ за подписване и верифициране на JWT токените
const secretKey = 'your-secret-key';

// Middleware за парсване на JSON тела на заявките
app.use(express.json());

// Middleware за проверка на JWT токен
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401); // Unauthorized
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user;
        next();
    });
};

// Примерен маршрут за регистрация на потребители (необходима логика за реална база данни)
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Ваша логика за регистрация на потребители

    res.json({ message: 'User registered successfully!' });
});

// Маршрут за логин на потребители с Keycloak
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Извикване на Keycloak за генериране на токен
        const response = await axios.post('http://keycloak-server/auth/realms/your-realm/protocol/openid-connect/token', {
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

// Примерен маршрут за GET заявка за данни (защитен с verifyToken middleware)
app.get('/data', verifyToken, (req, res) => {
    // Пример: връщане на данни според аутентикиран потребител
    res.json({ message: 'GET request successful!', data: dataStore, user: req.user });
});

// Примерен маршрут за PUT заявка за данни (защитен с verifyToken middleware)
app.put('/data', verifyToken, (req, res) => {
    // Пример: добавяне на данни според аутентикиран потребител
    const newData = req.body;
    dataStore.push(newData);
    res.json({ message: 'PUT request successful!', data: dataStore, user: req.user });
});

app.listen(port, () => {
    console.log(`Backend app listening at http://localhost:${port}`);
});
