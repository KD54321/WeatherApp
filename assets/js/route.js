'use strict'

import {updateWeather, error404} from "./app.js"

const defaultLocation = "#/weather?lat=45.5019&lon=-73.5674"

const currentLocation = function(){
    window.navigator.geolocation.getCurrentPosition(res=>{
        const {latitude, longitude} = res.coords;
        updateWeather(latitude, longitude);
    }, err=>{
        window.location.hash = defaultLocation;
    });
}

/**
 * @param {string} query Searched query - format: "lat=45.5019&lon=-73.5674"
 */
const searchedLocation = query => {
    const params = new URLSearchParams(query);
    const lat = params.get('lat');
    const lon = params.get('lon');
    
    if (lat && lon) {
        updateWeather(parseFloat(lat), parseFloat(lon));
    } else {
        error404();
    }
}

const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);

const checkHash = function(){
    const requestURL = window.location.hash.slice(1);
    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL];
    
    routes.get(route) ? routes.get(route)(query) : error404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function(){
    if(!this.window.location.hash){
        this.window.location.hash = "#/current-location";
    } else {
        checkHash();
    }
})