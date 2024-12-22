import React, { useEffect, useState } from 'react';
import './Weather.css';
import searchIcon from '../assets/search.png';
import clearIcon from '../assets/clear.png';
import humidityIcon from '../assets/humidity.png';
import windIcon from '../assets/wind.png';
import cloudIcon from '../assets/cloud.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';

const Weather = () => {
    const [weatherData, setWeatherData] = useState({
        temperature: '--',
        location: '--',
        humidity: '--',
        windSpeed: '--',
        icon: clearIcon,
    });
    const [city, setCity] = useState('');

    const allIcons = {
        "01d": clearIcon,
        "01n": clearIcon,
        "02d": cloudIcon,
        "02n": cloudIcon,
        "03d": cloudIcon,
        "03n": drizzleIcon,
        "04d": drizzleIcon,
        "04n": cloudIcon,
        "09d": rainIcon,
        "09n": rainIcon,
        "10d": rainIcon,
        "10n": rainIcon,
        "13d": snowIcon,
        "13n": snowIcon,
    };

    const search = async (city) => {
        if (!city) {
            console.error('City name cannot be empty');
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_APP_ID;
            if (!apiKey) {
                console.error('API key is missing');
                return;
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
            console.log(`Fetching weather data from: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                console.error('Failed to fetch weather data');
                return;
            }

            const data = await response.json();
            console.log(data);

            if (data.weather && data.weather.length > 0) {
                const icon = allIcons[data.weather[0]?.icon] || clearIcon;
                setWeatherData({
                    temperature: Math.floor(data.main.temp),
                    location: data.name,
                    humidity: data.main.humidity,
                    windSpeed: data.wind.speed,
                    icon,
                });
            } else {
                console.error('No weather data found for the given city.');
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    useEffect(() => {
        search('New York'); // Default city to fetch weather data for on load
    }, []);

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <img
                    src={searchIcon}
                    alt="search"
                    onClick={() => search(city)}
                />
            </div>
            <img src={weatherData.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temperature">{weatherData.temperature}°C</p>
            <p className="location">{weatherData.location}</p>
            <div className="weather-data">
                <div className="col">
                    <img src={humidityIcon} alt="Humidity Icon" />
                    <div>
                        <p>{weatherData.humidity}%</p>
                        <span>Humidity</span>
                    </div>
                </div>
                <div className="col">
                    <img src={windIcon} alt="Wind Speed Icon" />
                    <div>
                        <p>{weatherData.windSpeed} km/hr</p>
                        <span>Wind Speed</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Weather;