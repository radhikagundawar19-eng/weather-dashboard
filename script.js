// Weather Dashboard - API Integration
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org';

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const locationBtn = document.getElementById('locationBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('currentWeather');
const forecastSection = document.getElementById('forecastSection');
const recentList = document.getElementById('recentList');
const suggestionsDiv = document.getElementById('suggestions');

let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    searchBtn.addEventListener('click', handleSearch);
    locationBtn.addEventListener('click', handleGeolocation);
    cityInput.addEventListener('keypress', (e) => e.key === 'Enter' && handleSearch());
    cityInput.addEventListener('input', handleCitySuggestions);
    displayRecentSearches();
});

// Handle City Search
function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    fetchWeatherData(city);
}

// Handle Geolocation
function handleGeolocation() {
    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }
    
    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherDataByCoords(latitude, longitude);
        },
        () => {
            showError('Unable to access your location');
            showLoading(false);
        }
    );
}

// Handle City Suggestions
function handleCitySuggestions(e) {
    const query = e.target.value.trim();
    if (query.length < 2) {
        suggestionsDiv.classList.remove('active');
        return;
    }

    // Common cities for demo purposes
    const commonCities = [
        'New York', 'London', 'Tokyo', 'Paris', 'Sydney',
        'Dubai', 'Mumbai', 'Singapore', 'Toronto', 'Berlin',
        'Madrid', 'Bangkok', 'Los Angeles', 'Chicago', 'Houston'
    ];

    const filtered = commonCities.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length > 0) {
        suggestionsDiv.innerHTML = filtered.map(city =>
            `<div class="suggestion-item" onclick="selectCity('${city}')"> ${city}</div>`
        ).join('');
        suggestionsDiv.classList.add('active');
    } else {
        suggestionsDiv.classList.remove('active');
    }
}

// Select City from Suggestions
function selectCity(city) {
    cityInput.value = city;
    suggestionsDiv.classList.remove('active');
    fetchWeatherData(city);
}

// Fetch Weather Data by City
function fetchWeatherData(city) {
    showLoading(true);
    
    Promise.all([
        fetch(`${BASE_URL}/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)
    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([weatherData, forecastData]) => {
        if (weatherData.cod === '404') {
            showError('City not found. Please try again.');
            showLoading(false);
            return;
        }
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        addToRecentSearches(city);
        showError('');
        showLoading(false);
    })
    .catch(() => {
        showError('Unable to fetch weather data. Please check your API key.');
        showLoading(false);
    });
}

// Fetch Weather Data by Coordinates
function fetchWeatherDataByCoords(lat, lon) {
    Promise.all([
        fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    ])
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(([weatherData, forecastData]) => {
        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        addToRecentSearches(weatherData.name);
        cityInput.value = weatherData.name;
        showError('');
        showLoading(false);
    })
    .catch(() => {
        showError('Unable to fetch weather data. Please check your API key.');
        showLoading(false);
    });
}

// Display Current Weather
function displayCurrentWeather(data) {
    const { name, sys, main, weather, wind, clouds, visibility } = data;
    
    document.getElementById('cityName').textContent = `${name}, ${sys.country}`;
    document.getElementById('weatherDesc').textContent = weather[0].main;
    document.getElementById('temp').textContent = Math.round(main.temp);
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
    document.getElementById('visibility').textContent = `${(visibility / 1000).toFixed(1)} km`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('uvIndex').textContent = '--'; // UV Index requires separate API call
    document.getElementById('precipitation').textContent = `${data.rain?.['1h'] || 0} mm`;
    
    // Update Weather Icon
    updateWeatherIcon(weather[0].main);
    
    currentWeather.classList.remove('hidden');
}

// Display Forecast
function displayForecast(data) {
    const forecastList = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    
    const forecastHTML = forecastList.map(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].main;
        const icon = getWeatherEmoji(item.weather[0].main);
        
        return `
            <div class="forecast-card">
                <div class="forecast-date">${date}</div>
                <div class="forecast-icon">${icon}</div>
                <div class="forecast-temp">${temp}°C</div>
                <div class="forecast-desc">${desc}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('forecast').innerHTML = forecastHTML;
    forecastSection.classList.remove('hidden');
}

// Update Weather Icon
function updateWeatherIcon(weather) {
    const iconElement = document.getElementById('weatherIcon');
    const emoji = getWeatherEmoji(weather);
    iconElement.className = '';
    iconElement.textContent = emoji;
}

// Get Weather Emoji
function getWeatherEmoji(weather) {
    const weatherMap = {
        'Clear': '☀️',
        'Clouds': '☁️',
        'Rain': '🌧️',
        'Drizzle': '🌦️',
        'Thunderstorm': '⛈️',
        'Snow': '❄️',
        'Mist': '🌫️',
        'Smoke': '💨',
        'Haze': '🌫️',
        'Dust': '🌪️',
        'Fog': '🌫️',
        'Sand': '🌪️',
        'Ash': '💨',
        'Squall': '💨',
        'Tornado': '🌪️'
    };
    return weatherMap[weather] || '🌡️';
}

// Add to Recent Searches
function addToRecentSearches(city) {
    recentSearches = recentSearches.filter(c => c.toLowerCase() !== city.toLowerCase());
    recentSearches.unshift(city);
    recentSearches = recentSearches.slice(0, 10);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    displayRecentSearches();
}

// Display Recent Searches
function displayRecentSearches() {
    recentList.innerHTML = recentSearches.map(city =>
        `<div class="recent-item" onclick="selectCity('${city}')">${city}</div>`
    ).join('');
}

// Show/Hide Loading
function showLoading(show) {
    if (show) {
        loading.classList.remove('hidden');
    } else {
        loading.classList.add('hidden');
    }
}

// Show Error
function showError(message) {
    const errorDiv = document.getElementById('error');
    if (message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('active');
        errorDiv.classList.remove('hidden');
    } else {
        errorDiv.classList.remove('active');
        errorDiv.classList.add('hidden');
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!cityInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
        suggestionsDiv.classList.remove('active');
    }
});