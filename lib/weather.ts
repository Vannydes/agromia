import { fetchWeatherData, getWeatherFromGeolocation, type WeatherData } from './weather-api';

/**
 * Unified weather data structure for the app
 */
export type Weather = {
  temp: number;
  humidity: number;
  wind: number;
  condition: 'sunny' | 'rain' | 'wind' | 'cloudy' | 'fog';
  description: string;
  location?: string;
  weatherCode: number; // Open-Meteo weather code for detailed advice
};

/**
 * Cache for weather data to avoid multiple API calls per day
 */
let weatherCache: {
  data: Weather | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

/**
 * Convert WeatherData from API to internal Weather format
 */
function convertWeatherData(apiData: WeatherData): Weather {
  // Map weather codes to conditions
  const conditionMap: { [key: number]: Weather['condition'] } = {
    0: 'sunny', 1: 'sunny', 2: 'cloudy', 3: 'cloudy', // Clear to cloudy
    45: 'fog', 48: 'fog', // Fog
    51: 'rain', 53: 'rain', 55: 'rain', // Light rain
    61: 'rain', 63: 'rain', 65: 'rain', // Rain
    71: 'rain', 73: 'rain', 75: 'rain', 77: 'rain', // Snow (treat as rain for simplicity)
    80: 'rain', 81: 'rain', 82: 'rain', // Showers
    85: 'rain', 86: 'rain', // Snow showers
    95: 'rain', 96: 'rain', 99: 'rain', // Thunderstorms
  };

  return {
    temp: apiData.temperature,
    humidity: apiData.humidity,
    wind: apiData.windSpeed,
    condition: conditionMap[apiData.weatherCode] || 'sunny',
    description: apiData.weatherDescription,
    location: apiData.location,
    weatherCode: apiData.weatherCode,
  };
}

/**
 * Get current weather data with caching
 * Uses real weather API when available, returns null if all sources fail
 */
export async function getCurrentWeather(): Promise<Weather | null> {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // Cache for 1 hour

  // Return cached data if still valid
  if (weatherCache.data && (now - weatherCache.timestamp) < oneHour) {
    console.log('Weather: Returning cached weather data');
    return weatherCache.data;
  }

  console.log('Weather: Cache expired or empty, fetching new weather data');

  try {
    // Try to get real weather data (includes Rome fallback)
    const realWeather = await getWeatherFromGeolocation();

    if (realWeather) {
      const weather = convertWeatherData(realWeather);
      weatherCache = { data: weather, timestamp: now };
      console.log('Weather: Successfully cached new weather data');
      return weather;
    }
  } catch (error) {
    console.warn('Weather: Failed to fetch real weather data:', error);
  }

  // No fallback mock data - return null if all sources fail
  console.warn('Weather: All weather sources failed, returning null');
  return null;
}

/**
 * Get weather data synchronously (returns cached data or null)
 * Use this for components that need immediate data
 */
export function getWeatherSync(): Weather | null {
  if (weatherCache.data) {
    return weatherCache.data;
  }

  return null;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getCurrentWeather() instead - may return null
 */
export function getMockWeather(): Weather | null {
  return getWeatherSync();
}
