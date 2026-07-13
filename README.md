# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✨ **Current Weather Display**
- Real-time temperature, weather conditions, and "feels like" temperature
- Weather icon representation
- Detailed metrics:
  - Humidity
  - Wind speed
  - Visibility
  - Pressure
  - UV Index
  - Precipitation

📅 **5-Day Forecast**
- Daily forecast with temperature and weather conditions
- Weather emoji icons for quick visual reference
- Responsive grid layout

📍 **Geolocation Support**
- Get weather for your current location automatically
- Browser geolocation API integration

🔍 **City Search**
- Search for weather by city name
- Auto-complete suggestions for common cities
- Case-insensitive search

📌 **Recent Searches**
- Automatically saves your recent searches to localStorage
- Quick access to previously searched cities
- Up to 10 recent searches stored

📱 **Responsive Design**
- Mobile-friendly layout
- Adapts to all screen sizes
- Touch-friendly buttons and interactions

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Go to your API keys section
4. Copy your API key

### 2. Add Your API Key

Open `script.js` and replace:
```javascript
const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
```

With your actual API key:
```javascript
const API_KEY = 'abc123xyz456';
```

### 3. Open in Browser

Simply open `index.html` in your web browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js with http-server
http-server

# Using npm
npx serve
```

Then visit `http://localhost:8000` (or your chosen port) in your browser.

## Usage

1. **Search by City**: Enter a city name and press Enter or click the Search button
2. **Get Current Location**: Click the location icon button to fetch weather for your current location
3. **View Suggestions**: As you type, suggestions for common cities will appear
4. **Access Recent Searches**: Click any recent search to quickly get that city's weather

## Project Structure

```
weather-dashboard/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # JavaScript logic and API integration
└── README.md       # Documentation
```

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)** - Async/await, fetch API, localStorage
- **OpenWeatherMap API** - Weather data provider
- **Font Awesome** - Weather and UI icons

## API Endpoints Used

1. **Current Weather**
   ```
   https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric
   ```

2. **Weather Forecast**
   ```
   https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric
   ```

## Features in Detail

### Error Handling
- Graceful error messages for invalid cities
- API key validation
- Network error handling
- Geolocation permission denial handling

### Performance
- Optimized API calls (parallel fetching)
- Debounced search suggestions
- LocalStorage caching for recent searches
- Smooth animations and transitions

### Accessibility
- Semantic HTML structure
- ARIA labels for screen readers (can be enhanced)
- Keyboard navigation support
- High contrast design

## Customization

### Change Temperature Units
Modify the `units=metric` parameter in API calls:
- `metric` - Celsius (default)
- `imperial` - Fahrenheit

### Add More Weather Metrics
Extend the detail cards in `index.html` and add corresponding data fields in `script.js`

### Customize Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    /* ... more variables ... */
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Unit conversion (°C ↔ °F)
- [ ] Weather alerts and warnings
- [ ] Air quality index (AQI)
- [ ] Historical weather data
- [ ] Weather charts and graphs
- [ ] Multi-city comparison
- [ ] Hourly forecast

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the OpenWeatherMap API documentation
2. Verify your API key is valid
3. Ensure your browser allows geolocation
4. Check browser console for error messages

## Credits

Built with ❤️ using OpenWeatherMap API and Font Awesome icons.