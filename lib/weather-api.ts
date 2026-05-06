// Open-Meteo API client for weather data
// No API key required - free and open source

export type WeatherData = {
  temperature: number;
  humidity: number;
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
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&temperature_unit=celsius&timezone=auto`
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
 * Get user's geolocation and fetch weather
 * @returns Weather data or null if geolocation is denied
 */
export async function getWeatherFromGeolocation(): Promise<WeatherData | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported by this browser');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherData = await fetchWeatherData(latitude, longitude);
        resolve(weatherData);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
      }
    );
  });
}

/**
 * Get agricultural advice based on weather conditions
 */
export function getAgriculturalAdvice(weather: WeatherData, moonPhase: string): string {
  const { temperature, humidity, weatherCode } = weather;

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

  // Clear weather - good for work
  if (weatherCode <= 3) {
    return '☀️ Condizioni ideali - Perfetto per lavorare nell\'orto.';
  }

  return '✅ Condizioni normali - Continua le attività ordinarie.';
}