const express = require('express')
const router = express.Router();
const weatherController = require('../controllers/weather.controller')
const rateLimiter = require('../middleware/rateLimiter')

router.get('/current', rateLimiter, weatherController.getCurrentWeather);
router.get('/forecast', rateLimiter, weatherController.getForecast);
router.get('/air-quality', rateLimiter, weatherController.getAirQuality);
router.get('/search', weatherController.searchLocation);
router.get('/reverse-geocode', weatherController.reverseGeocode);

router.get('/all', rateLimiter, weatherController.getAllWeatherData);

module.exports = router;