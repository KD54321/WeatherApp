'use strict';
const API_BASE_URL = 'http://localhost:3000/api/weather'
/**
 * 
 * @param {string} endpoint API url 
 * @param {Function} callback callback
 */
export const fetchData = function(endpoint, callback){
    fetch(`${API_BASE_URL}${endpoint}`)
    .then(res=>{
        if(!res.ok){
            throw new Error(`HTTP error. status: ${res.status}`)
        }
        return res.json();
}).then(response=>{
    if(response.success){
        callback(response.data);
    }else{
        throw new Error(response.error || 'API request failed')
    }
}).catch(error=>{
    console.log('API Error:', error)
})
}

export const url = {
    currentWeather(lat, lon){
        return `/current?lat=${lat}&lon=${lon}`;
    },
    forecast(lat, lon){
        return `/forecast?lat=${lat}&lon=${lon}`;
    },
    airPollution(lat, lon){
        return `/air-quality?lat=${lat}&lon=${lon}`;
    },
    reverseGeo(lat, lon){
        return `/reverse-geocode?lat=${lat}&lon=${lon}`;
    },
    geo(query){
        return `/search?q=${encodeURIComponent(query)}`;
    },
    // NEW: Get all data in one call (more efficient!)
    allWeatherData(lat, lon){
        return `/all?lat=${lat}&lon=${lon}`;
    }
}