// Open-Meteo API client for weather data
// No API key required - free and open source

export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherDescription: string;
  location: string;
};

/**
 * Get weather description from WMO weather code
 * https://www.open-meteo.com/en/docs
 */
function getWeatherDescription(code: number): string {
  const weatherCodes: { [key: number]: string } = {
    // Clear, Mainly clear
    0: '☀️ Cielo sereno',
    1: '🌤️ Principalmente sereno',
    2: '⛅ Parzialmente nuvoloso',
    3: '☁️ Nuvoloso',

    // Precipitation
    45: '🌫️ Nebbia',
    48: '🌫️ Nebbia gelata',
    51: '🌧️ Pioggia leggera',
    53: '🌧️ Pioggia moderata',
    55: '⛈️ Pioggia forte',
    61: '🌧️ Pioggia',
    63: '🌧️ Pioggia moderata',
    65: '⛈️ Pioggia forte',
    71: '❄️ Neve leggera',
    73: '❄️ Neve moderata',
    75: '❄️ Neve forte',
    77: '❄️ Granelli di neve',
    80: '🌧️ Rovesci leggeri',
    81: '🌧️ Rovesci moderati',
    82: '⛈️ Rovesci forti',
    85: '❄️ Rovesci di neve leggeri',
    86: '❄️ Rovesci di neve forti',
    95: '⛈️ Temporale',
    96: '⛈️ Temporale con grandine',
    99: '⛈️ Temporale forte',
  };

  return weatherCodes[code] || '🌡️ Condizioni sconosciute';
}

/**
 * Fetch weather data from Open-Meteo API
 * @param latitude - Location latitude
 * @param longitude - Location longitude
 * @returns Weather data
 */
export async function fetchWeatherData(latitude: number, longitude: number): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&timezone=auto`
    );

    if (!response.ok) {
      console.error('Weather API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    const current = data.current;

    if (!current) {
      return null;
    }

    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      weatherCode: current.weather_code,
      weatherDescription: getWeatherDescription(current.weather_code),
      location: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

/**
 * Get weather data for Rome, Italy as fallback
 * @returns Weather data for Rome
 */
export async function getWeatherForRome(): Promise<WeatherData | null> {
  // Rome coordinates: 41.9028° N, 12.4964° E
  return await fetchWeatherData(41.9028, 12.4964);
}

/**
 * Get user's geolocation and fetch weather, fallback to Rome
 * @returns Weather data - either from user location or Rome fallback
 */
export async function getWeatherFromGeolocation(): Promise<WeatherData | null> {
  return new Promise(async (resolve) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      console.warn('Weather: Geolocation not supported by this browser, using Rome fallback');
      const romeWeather = await getWeatherForRome();
      resolve(romeWeather);
      return;
    }

    console.log('Weather: Requesting geolocation permission from browser...');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Weather: Geolocation permission granted! Coordinates:', { latitude, longitude });

        const weatherData = await fetchWeatherData(latitude, longitude);
        if (weatherData) {
          console.log('Weather: Successfully fetched weather for user location');
        }
        resolve(weatherData);
      },
      async (error) => {
        console.warn('Weather: Geolocation permission denied or failed:', error.message, 'using Rome fallback');
        const romeWeather = await getWeatherForRome();
        console.log('Weather: Using Rome, Italy weather data as fallback');
        resolve(romeWeather);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: 300000, // Accept cached position up to 5 minutes old
      }
    );
  });
}

/**
 * Get agricultural advice based on weather conditions
 */
export function getAgriculturalAdvice(weather: { temperature: number; humidity: number; weatherCode: number; windSpeed?: number }, moonPhase: string): string {
  const { temperature, humidity, weatherCode, windSpeed } = weather;

  // High humidity - risk of fungal diseases
  if (humidity > 85) {
    return '⚠️ Umidità alta - Rischio malattie fungine. Evita bagnare le foglie.';
  }

  // Low humidity - risk of stress
  if (humidity < 40) {
    return '💧 Umidità bassa - Piante a rischio stress. Aumenta irrigazioni.';
  }

  // Very hot - irrigation needed at sunset
  if (temperature > 28) {
    return '🌡️ Caldo intenso - Irrigare al tramonto. Proteggi con ombreggiamento.';
  }

  // Cold - frost risk
  if (temperature < 5) {
    return '❄️ Freddo - Rischio gelate. Proteggi le piantine sensibili.';
  }

  // Rainy weather
  if (weatherCode >= 51 && weatherCode <= 86) {
    if (moonPhase.includes('crescente')) {
      return '🌧️ Pioggia - Perfetto per trapianti e nuove piantagioni.';
    } else {
      return '🌧️ Pioggia - Buono per manutenzione del terreno.';
    }
  }

  // Strong wind - protect plants
  if (windSpeed && windSpeed > 20) {
    return '💨 Vento forte - Proteggi le piante delicate e evita trattamenti.';  
  }

  // Clear weather - good for work
  if (weatherCode <= 3) {
    return '☀️ Condizioni ideali - Perfetto per lavorare nell\'orto.';
  }

  return '✅ Condizioni normali - Continua le attività ordinarie.';
}