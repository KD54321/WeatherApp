'use strict'

import {updateWeather, error404} from "./app.js"

const defaultLocation = "#/weather?lat=45.5019&lon=-73.5674" // Fixed: lon not lon=73

const currentLocation = function(){
    window.navigator.geolocation.getCurrentPosition(res=>{
        const {latitude, longitude} = res.coords;
        updateWeather(`lat=${latitude}`, `lon=${longitude}`); // These add "lat=" and "lon="

    }, err=>{
        window.location.hash = defaultLocation;
    });
}

/**
 * 
 * @param {string} query Searched query
 */
const searchedLocation = query=> updateWeather(...query.split("&"));
// This splits "lat=45.5019&lon=-73.5674" into ["lat=45.5019", "lon=-73.5674"]
// So updateWeather receives them as separate arguments



const routes = new Map([
    ["/current-location", currentLocation],
    ["/weather", searchedLocation]
]);

const checkHash = function(){
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes("?") ? requestURL.split("?") : [requestURL]; // Fixed: added "?"

    routes.get(route) ? routes.get(route)(query) : error404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function(){
    if(!this.window.location.hash){
        this.window.location.hash = "#/current-location";
    }
    else{
        checkHash()
    }
})