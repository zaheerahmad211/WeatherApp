import React, { useEffect, useState } from 'react'
import './Weather.css'
import clear_icon from '../assets/clear.png'
import humidity_icon from '../assets/humidity.png'
import search_icon from '../assets/search.png'
import wind_icon from '../assets/wind.png'

const Weather = () => {
  const [weather, setWeather] = useState(null);

  const search = async (city) => {
    try {
      // 1. Convert city -> lat/lon
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        alert("City not found");
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      // 2. Fetch weather
      const weatherUrl = `
        https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m
      `;

      const res = await fetch(weatherUrl);
      const data = await res.json();

      // Get latest hour index
      const lastIndex = data.hourly.temperature_2m.length - 1;

      setWeather({
        city: name,
        temperature: Math.round(data.hourly.temperature_2m[lastIndex]),
        humidity: data.hourly.relativehumidity_2m[lastIndex],
        windspeed: data.hourly.windspeed_10m[lastIndex]
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    search("Islamabad");
  }, []);

  if (!weather) return <h2 className='loading'>Loading Weather...</h2>;

  return (
    <div className="weather">
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search city..."
          onKeyDown={(e) => {
            if (e.key === "Enter") search(e.target.value);
          }}
        />
        <img 
          src={search_icon} 
          alt="Search" 
          onClick={() => {
            const city = document.querySelector("input").value;
            search(city);
          }}
        />
      </div>

      <img src={clear_icon} alt="" className="weather-icon" />
      <p className="temperature">{weather.temperature}°C</p>
      <p className="location">{weather.city}</p>

      <div className="weather-data">
        <div className="col">
          <img src={humidity_icon} alt="" />
          <p>{weather.humidity}%</p>
          <span>Humidity</span>
        </div>
        <div className="col">
          <img src={wind_icon} alt="" />
          <p>{weather.windspeed} km/h</p>
          <span>Wind Speed</span>
        </div>
      </div>
    </div>
  );
};

export default Weather;
