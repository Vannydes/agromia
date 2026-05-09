import type { Weather } from './weather';
import type { CropConfig } from './crops';

/**
 * Get personalized crop advice based on current weather conditions
 */
export function getAdvice(crop: CropConfig | { name: string }, weather: Weather): string {
  const cropName = (crop as any).name?.toLowerCase() || '';

  // Pomodoro advice
  if (cropName.includes('pomodoro')) {
    if (weather.humidity > 75) {
      return 'Alta umidità: rischio peronospora. Valuta trattamento naturale.';
    }
    if (weather.temp > 32) {
      return 'Caldo intenso: irrigare al tramonto.';
    }
  }

  // Zucchina advice
  if (cropName.includes('zucchina')) {
    if (weather.humidity > 80) {
      return 'Attenzione oidio: controlla le foglie.';
    }
  }

  // Wind protection for delicate plants
  if (weather.wind > 25) {
    if (cropName.includes('pomodoro') || cropName.includes('peperone') || cropName.includes('melanzana')) {
      return 'Vento forte: proteggi i fiori e i frutti in formazione.';
    }
  }

  // Default advice
  return 'Condizioni nella norma.';
}
