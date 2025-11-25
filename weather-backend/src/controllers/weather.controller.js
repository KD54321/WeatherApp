const openweatherService = require('../services/openweather.service');
const OpenWeatherService = require('../services/openweather.service');

exports.getCurrentWeather = async(req, res, next)=>{
    try{
        const{lat, lon} = req.query;
        if(!lat||!lon){
            return res.status(400).json({
                success:false,
                error:'Latitude and longitude are required'
            })
        }
        const data = await openweatherService.getCurrentWeather(lat, lon);
        res.json({success:true,
            data:data
        });
    }
    catch(error){
        next(error);
    }
}

exports.getForecast = async(req, res, next)=>{
    try{
    const {lat, lon} = req.query;
    if(!lat||!lon){
        return res.status(400).json({
            success:false,
            error: 'Latitude and longitude are required'
        })
    }
    const data = await openweatherService.getForecast(lat,lon);
    res.json({
        success:true,
        data: data
    })
    }
    catch(error){
        next(error);
    }
};

exports.getAirQuality = async(req, res, next)=>{
    try{
        const {lat, lon} = req.query;
        if(!lat||!lon){
            return res.status(400).json({
                success:false,
                error: 'Latitude and longitude are required'
            })
        }
        const data = await openweatherService.getAirQuality(lat, lon);
        res.json({
            success:true,
            data:data
        })
    }
    catch(error){
        next(error);
    }
}

exports.getAllWeatherData = async (req, res, next)=>{
    try{
        const {lat, lon} = req.query;
        if(!lat||!lon){
            return res.status(400).json({
                success:false,
                error: ' Latitude and longitude are required'
            })
        }
        const data = await openweatherService.getAllWeatherData(lat, lon);
        res.json({
            success:true,
            data:data
        })
    }
    catch(error){
        next(error);
    }
}

exports.searchLocation = async (req, res, next)=>{
    try{
        const{q} = req.query;
        if(!q){
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            })
        }
        const data = await openweatherService.searchLocation(q);
        res.json({
            success:true,
            data:data
        })
    }
        catch(error){
            next(error);
        }
    }

exports.reverseGeocode = async(req, res, next)=>{
    try{
 const {lat, lon} = req.query;
        if(!lat||!lon){
            return res.status(400).json({
                success:false,
                error: ' Latitude and longitude are required'
            })
        }
        const data = await openweatherService.reverseGeocode(lat, lon);
        res.json({
            success:true,
            data:data
        })
    }
    catch(error){
        next(error)
    }
}