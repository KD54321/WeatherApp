const express = require('express')
const cors = require('cors')
const weatherRoutes = require('./routes/weather.routes')
const errorHandler = require('./middleware/errorHandler')

const app = express();

// Allow multiple origins for development
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5501', 'http://127.0.0.1:5501'],
    credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: 'Weather API is running'
    })
})

app.use('/api/weather', weatherRoutes);

app.use(errorHandler);

module.exports = app;