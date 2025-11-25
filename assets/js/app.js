'use strict'

import {fetchData, url} from "./api.js"
import * as module from "./module.js"

/**
 * 
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

export const updateWeather = function(lat, lon) {
    console.log('Updating weather for:', lat, lon);
    
    // Fetch all weather data
    fetchData(url.allWeatherData(lat, lon), function(data) {
        console.log('All weather data received:', data);
        
    });
}

export const error404 = function() {
    const errorContent = document.querySelector("[data-error-content]");
    if (errorContent) {
        errorContent.style.display = "flex";
    }
    console.error('404 - Page not found');
}