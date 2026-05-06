/**
 * Mock weather data structure
 */
export type Weather = {
  temp: number;
  humidity: number;
  wind: number;
  condition: 'sunny' | 'rain' | 'wind';
};

/**
 * Get mock weather data
 * Returns fixed values for demonstration
 */
export function getMockWeather(): Weather {
  return {
    temp: 28,
    humidity: 72,
    wind: 12,
    condition: 'sunny'
  };
}
