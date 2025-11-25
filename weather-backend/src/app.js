const express = require('express')
const cors = require('cors')
const weatherRoutes = require('./routes/weather.routes')
const errorHandler = require('./middleware/errorHandler')

const app = express();

const allowedOrigins = process.env.NODE_ENV === 'production'?[process.env.FRONTEND_URL, 'http://localhost']:['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:5501', 'http://127.0.0.1:5501'];

app.use(cors({
    origin: function(origin, callback){
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin)===-1 && process.env.NODE_ENV==='production'){
            return callback(new Error('CORS not allowed', false));
        }
        return callback(null, true);
    }
}))

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