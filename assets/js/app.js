'use strict'

import {fetchData, url} from "./api.js"
import * as module from "./module.js"

/**
 * Add event on multiple elements
 * @param {NodeList} elements Elements node array
 * @param {string} eventType Event type e.g.: "click", "mouseover" 
 * @param {Function} callback Callback function 
 */
const addEventOnElements = function(elements, eventType, callback){
    for(const element of elements) element.addEventListener(eventType, callback);
}

/**
 * Toggle search in mobile devices
 */
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

/**
 * SEARCH INTEGRATION
 */
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null;
const searchTimeoutDuration = 500;

searchField.addEventListener("input", function() {
    searchTimeout ?? clearTimeout(searchTimeout);
    
    if (!searchField.value) {
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("searching");
    } else {
        searchField.classList.add("searching");
    }
    
    if (searchField.value) {
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function(locations) {
                searchField.classList.remove("searching");
                searchResult.classList.add("active");
                searchResult.innerHTML = `
                    <ul class="view-list" data-search-list></ul>
                `;
                
                const items = [];
                
                for (const {name, lat, lon, country, state} of locations) {
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("view-item");
                    
                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
                        <div>
                            <p class="item-title">${name}</p>
                            <p class="label-2 item-subtitle">${state || ""} ${country}</p>
                        </div>
                        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" aria-label="${name} weather" data-search-toggler></a>
                    `;
                    
                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }
                
                addEventOnElements(items, "click", function() {
                    toggleSearch();
                    searchResult.classList.remove("active");
                });
            });
        }, searchTimeoutDuration);
    }
});

/**
 * Update weather information
 * @param {number} lat Latitude
 * @param {number} lon Longitude
 */
export const updateWeather = function(lat, lon) {
    console.log('Updating weather for:', lat, lon);
    
    const loading = document.querySelector("[data-loading]");
    const currentWeatherSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    const forecastSection = document.querySelector(".forecast");
    const errorContent = document.querySelector("[data-error-content]");
    
    loading.style.display = "grid";
    currentWeatherSection.style.display = "none";
    highlightSection.style.display = "none";
    hourlySection.style.display = "none";
    if(forecastSection) forecastSection.style.display = "none";
    errorContent.style.display = "none";
    
    // Fetch all weather data in one call
    fetchData(url.allWeatherData(lat, lon), function(data) {
        console.log('All weather data received:', data);
        
        const {
            current: currentWeather,
            forecast,
            airQuality
        } = data;
        
        // Update current weather
        updateCurrentWeather(currentWeather);
        
        // Update highlights (including air quality)
        updateHighlights(currentWeather, airQuality);
        
        // Update hourly forecast
        updateHourlyForecast(forecast);
        
        // Update 5-day forecast
        update5DayForecast(forecast);
        
        loading.style.display = "none";
        currentWeatherSection.style.display = "block";
        highlightSection.style.display = "block";
        hourlySection.style.display = "block";
        if(forecastSection) forecastSection.style.display = "block";
    });
}

/**
 * Update current weather display
 */
const updateCurrentWeather = function(weatherData) {
    const currentWeatherCard = document.querySelector("[data-current-weather]");
    const {
        weather,
        dt: dateUnix,
        sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
        main: {temp, feels_like, pressure, humidity},
        visibility,
        timezone
    } = weatherData;
    
    const [{description, icon}] = weather;
    
    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");
    
    card.innerHTML = `
        <h2 class="title-2 card-title">Now</h2>
        <div class="wrapper">
            <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>
            <img src="https://openweathermap.org/img/wn/${icon}@4x.png" width="64" height="64" alt="${description}" class="weather-icon">
        </div>
        <p class="body-3">${description}</p>
        <ul class="meta-list">
            <li class="meta-item">
                <span class="m-icon">calendar_today</span>
                <p class="title-3 meta-text">${module.getDate(dateUnix, timezone)}</p>
            </li>
            <li class="meta-item">
                <span class="m-icon">location_on</span>
                <p class="title-3 meta-text" data-location></p>
            </li>
        </ul>
    `;
    
    // Fetch location name
    fetchData(url.reverseGeo(weatherData.coord.lat, weatherData.coord.lon), function(locations) {
        const [{name, country}] = locations;
        card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
    });
    
    currentWeatherCard.innerHTML = "";
    currentWeatherCard.appendChild(card);
}

/**
 * Update highlights section
 */
const updateHighlights = function(weatherData, airQualityData) {
    const {
        main: {feels_like, humidity, pressure},
        sys: {sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
        visibility,
        timezone
    } = weatherData;
    
    const {
        list: [{
            main: {aqi},
            components: {no2, o3, so2, pm2_5}
        }]
    } = airQualityData;
    
    const highlightsCard = document.querySelector("[data-highlights]");
    
    const card = document.createElement("div");
    card.classList.add("card", "card-lg");
    
    card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Today's Highlights</h2>
        <div class="highlight-list">
            <div class="card card-sm highlight-card one">
                <h3 class="title-3">Air Quality Index</h3>
                <div class="wrapper">
                    <span class="m-icon">air</span>
                    <ul class="card-list">
                        <li class="card-item">
                            <p class="title-1">${pm2_5.toFixed(1)}</p>
                            <p class="label-1">PM<sub>2.5</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${so2.toFixed(1)}</p>
                            <p class="label-1">SO<sub>2</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${no2.toFixed(1)}</p>
                            <p class="label-1">NO<sub>2</sub></p>
                        </li>
                        <li class="card-item">
                            <p class="title-1">${o3.toFixed(1)}</p>
                            <p class="label-1">O<sub>3</sub></p>
                        </li>
                    </ul>
                </div>
                <span class="badge aqi-${aqi} label-1" title="${module.aqiText[aqi].message}">
                    ${module.aqiText[aqi].level}
                </span>
            </div>

            <div class="card card-sm highlight-card two">
                <h3 class="title-3">Sunrise & Sunset</h3>
                <div class="card-list">
                    <div class="card-item">
                        <span class="m-icon">clear_day</span>
                        <div>
                            <p class="label-1">Sunrise</p>
                            <p class="title-1">${module.getHours(sunriseUnixUTC, timezone)}</p>
                        </div>
                    </div>
                    <div class="card-item">
                        <span class="m-icon">clear_night</span>
                        <div>
                            <p class="label-1">Sunset</p>
                            <p class="title-1">${module.getHours(sunsetUnixUTC, timezone)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card card-sm highlight-card">
                <h3 class="title-3">Humidity</h3>
                <div class="wrapper">
                    <span class="m-icon">humidity_percentage</span>
                    <p class="title-1">${humidity}<sub>%</sub></p>
                </div>
            </div>

            <div class="card card-sm highlight-card">
                <h3 class="title-3">Pressure</h3>
                <div class="wrapper">
                    <span class="m-icon">airwave</span>
                    <p class="title-1">${pressure}<sub>hPa</sub></p>
                </div>
            </div>

            <div class="card card-sm highlight-card">
                <h3 class="title-3">Visibility</h3>
                <div class="wrapper">
                    <span class="m-icon">visibility</span>
                    <p class="title-1">${visibility / 1000}<sub>km</sub></p>
                </div>
            </div>

            <div class="card card-sm highlight-card">
                <h3 class="title-3">Feels Like</h3>
                <div class="wrapper">
                    <span class="m-icon">thermostat</span>
                    <p class="title-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                </div>
            </div>
        </div>
    `;
    
    highlightsCard.innerHTML = "";
    highlightsCard.appendChild(card);
}

/**
 * Update hourly forecast
 */
const updateHourlyForecast = function(forecastData) {
    const hourlySection = document.querySelector("[data-hourly-forecast]");
    
    const {
        list: forecastList,
        city: {timezone}
    } = forecastData;
    
    hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>
        <div class="slider-container">
            <ul class="slider-list" data-temp></ul>
            <ul class="slider-list" data-wind></ul>
        </div>
    `;
    
    // Get only next 8 entries (24 hours, 3-hour intervals)
    for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;
        
        const {
            dt: dateTimeUnix,
            main: {temp},
            weather,
            wind: {deg: windDirection, speed: windSpeed}
        } = data;
        
        const [{icon, description}] = weather;
        
        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");
        
        tempLi.innerHTML = `
            <div class="card card-sm slider-card">
                <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                     width="48" height="48" loading="lazy" alt="${description}" 
                     class="weather-icon" title="${description}">
                <p class="body-3">${parseInt(temp)}&deg;</p>
            </div>
        `;
        hourlySection.querySelector("[data-temp]").appendChild(tempLi);
        
        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");
        
        windLi.innerHTML = `
            <div class="card card-sm slider-card">
                <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                     width="48" height="48" loading="lazy" alt="${description}" 
                     class="weather-icon" title="${description}">
                <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
            </div>
        `;
        hourlySection.querySelector("[data-wind]").appendChild(windLi);
    }
}

/**
 * Update 5-day forecast
 */
const update5DayForecast = function(forecastData) {
    const forecastSection = document.querySelector(".forecast");
    
    const {
        list: forecastList,
        city: {timezone}
    } = forecastData;
    
    forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>
        <div class="card card-lg forecast-card">
            <ul></ul>
        </div>
    `;
    
    // Get one forecast per day (at noon)
    const forecastUl = forecastSection.querySelector("ul");
    
    for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
            main: {temp_max},
            weather,
            dt_txt
        } = forecastList[i];
        
        const [{icon, description}] = weather;
        const date = new Date(dt_txt);
        
        const li = document.createElement("li");
        li.classList.add("card-item");
        
        li.innerHTML = `
            <div class="icon-wrapper">
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" 
                     width="36" height="36" alt="${description}" 
                     class="weather-icon">
                <span class="span">
                    <p class="title-2">${parseInt(temp_max)}&deg;</p>
                </span>
            </div>
            <p class="label-1">${date.getDate()} ${module.monthNames[date.getMonth()]}</p>
            <p class="label-1">${module.weekDayNames[date.getDay()]}</p>
        `;
        
        forecastUl.appendChild(li);
    }
}

export const error404 = function() {
    const errorContent = document.querySelector("[data-error-content]");
    if (errorContent) {
        errorContent.style.display = "flex";
    }
    console.error('404 - Page not found');
}