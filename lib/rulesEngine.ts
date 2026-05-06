import type { CropEvent } from '@/lib/userCrops';

export type Rule = {
  crop: string;
  afterEvent: CropEvent['type'];
  daysAfter: number;
  message: string;
};

const rules: Rule[] = [
  // Pomodoro rules
  {
    crop: 'pomodoro',
    afterEvent: 'trapianto',
    daysAfter: 7,
    message: 'È il momento di controllare l\'attecchimento delle piante',
  },
  {
    crop: 'pomodoro',
    afterEvent: 'trapianto',
    daysAfter: 15,
    message: 'Valuta una prima concimazione',
  },
  {
    crop: 'pomodoro',
    afterEvent: 'trapianto',
    daysAfter: 30,
    message: 'Controlla la crescita e prepara i sostegni',
  },
  {
    crop: 'pomodoro',
    afterEvent: 'trapianto',
    daysAfter: 45,
    message: 'Potatura e agatura per aumentare la circolazione dell\'aria',
  },
  {
    crop: 'pomodoro',
    afterEvent: 'concimazione',
    daysAfter: 14,
    message: 'Valuta una nuova concimazione',
  },

  // Zucchina rules
  {
    crop: 'zucchina',
    afterEvent: 'trapianto',
    daysAfter: 10,
    message: 'Controlla irrigazione e crescita fogliare',
  },
  {
    crop: 'zucchina',
    afterEvent: 'trapianto',
    daysAfter: 25,
    message: 'Le prime fioriture dovrebbero apparire. Assicura una buona irrigazione',
  },
  {
    crop: 'zucchina',
    afterEvent: 'trapianto',
    daysAfter: 40,
    message: 'Inizio della raccolta previsto. Controllare quotidianamente',
  },

  // Insalata rules
  {
    crop: 'insalata',
    afterEvent: 'trapianto',
    daysAfter: 10,
    message: 'Controlla le giovani piante e assicura una buona irrigazione',
  },
  {
    crop: 'insalata',
    afterEvent: 'trapianto',
    daysAfter: 25,
    message: 'Primo raccolta di foglie esterne possibile',
  },
];

export function getDaysSinceEvent(event: CropEvent) {
  const today = new Date();
  const eventDate = new Date(event.date);
  const diffDays = Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getSmartSuggestions(cropName: string, events: CropEvent[]) {
  return rules
    .filter((rule) => rule.crop === cropName.toLowerCase())
    .map((rule) => {
      const event = events.find((e) => e.type === rule.afterEvent);
      if (!event) return null;

      const diffDays = getDaysSinceEvent(event);

      if (diffDays >= rule.daysAfter && diffDays < rule.daysAfter + 3) {
        return {
          message: rule.message,
          days: diffDays,
        };
      }

      return null;
    })
    .filter(Boolean) as Array<{ message: string; days: number }>;
}
