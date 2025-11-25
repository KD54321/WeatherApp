const axios = require('axios');

class OpenWeatherService{
    constructor(){
        this.apiKey = process.env.OPENWEATHER_API_KEY;
        this.baseURL = "https://api.openweathermap.org/data/2.5";
        this.geoUrl = "http://api.openweathermap.org/geo/1.0"
    }

    async getCurrentWeather(lat, lon){
        const url = `${this.baseURL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        const response = await axios.get(url);
        return response.data;
    }

    async getForecast(lat, lon){
        const url = `${this.baseURL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        const response = await axios.get(url);
        return response.data;
    }
    
    async getAirQuality(lat, lon){
        const url = `${this.baseURL}/air_pollution?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`
        const response = await axios.get(url);
        return response.data;
    }

    async reverseGeocode(lat, lon) {
    try {
      const url = `${this.geoUrl}/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${this.apiKey}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to reverse geocode: ${error.message}`);
    }
  }


  async searchLocation(query) {
    try {
      const url = `${this.geoUrl}/direct?q=${query}&limit=5&appid=${this.apiKey}`;
      console.log(`Search URL: ${url}`)
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to search location: ${error.message}`);
    }
  }

    async getAllWeatherData(lat, lon) {
    try {
      const [currentWeather, forecast, airQuality] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getForecast(lat, lon),
        this.getAirQuality(lat, lon)
      ]);

      return {
        current: currentWeather,
        forecast: forecast,
        airQuality: airQuality
      };
    } catch (error) {
      throw new Error(`Failed to fetch all weather data: ${error.message}`);
    }
  }

}
module.exports = new OpenWeatherService();