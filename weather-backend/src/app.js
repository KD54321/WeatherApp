const express = require('express')
const cors = require('cors')
const weatherRoutes = require('./routes/weather.routes')
const errorHandler = require('./middleware/errorHandler')

const app = express();

app.use(cors({
    origin: 'http://localhost:5500'
}));
app.use(express.json());

app.get('/health', (req, res)=>{
    res.json({status:'ok', timestamp: new Date().toISOString()})
})

app.use('/api/weather', weatherRoutes);

app.use(errorHandler);
module.exports = app;