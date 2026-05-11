import type { Weather } from '@/lib/weather';
import type { Crop } from '@/lib/cropDataService';
import { cropKeys, type CropKey } from '@/lib/crops';

export type AgronomicTaskColor = 'red' | 'orange' | 'yellow' | 'blue' | 'green';

export type AgronomicTask = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: AgronomicTaskColor;
};

function getSeason(date: Date) {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return 'primavera';
  if (month >= 6 && month <= 8) return 'estate';
  if (month >= 9 && month <= 11) return 'autunno';
  return 'inverno';
}

function daysSince(dateString: string) {
  const eventDate = new Date(dateString);
  if (Number.isNaN(eventDate.getTime())) return 0;

  const today = new Date();
  const diff = Math.floor((today.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(0, diff);
}

function normalizeCropName(name: string) {
  return name.trim().toLowerCase();
}

function getCropAge(crop: Crop) {
  const transplantDate = crop.transplant_date;
  if (transplantDate) {
    return daysSince(transplantDate);
  }

  return undefined;
}

function createCropTask(crop: Crop, days?: number) {
  if (days === undefined) {
    return null;
  }

  const name = normalizeCropName(crop.name);

  const taskSets: Array<{
    match: string;
    tasks: Array<{
      range: [number, number] | [number, null];
      title: string;
      description: string;
      color: AgronomicTaskColor;
      icon: string;
    }>;
  }> = [
    {
      match: 'pomodoro',
      tasks: [
        {
          range: [7, 10],
          title: 'Controlla attecchimento',
          description: 'Verifica foglie ingiallite e crescita iniziale.',
          color: 'yellow',
          icon: '🟡',
        },
        {
          range: [15, 20],
          title: 'Prima sarchiatura',
          description: 'Elimina erbacce e smuovi il terreno.',
          color: 'yellow',
          icon: '🟡',
        },
        {
          range: [30, 40],
          title: 'Concimazione',
          description: 'Aggiungi fertilizzante biologico.',
          color: 'orange',
          icon: '🟠',
        },
        {
          range: [45, 60],
          title: 'Controlla femminelle',
          description: 'Rimuovi i getti laterali.',
          color: 'yellow',
          icon: '🟡',
        },
        { range: [70, null], title: 'Inizio maturazione', description: "Riduci leggermente l'acqua.", color: 'green', icon: '🟢' },
      ],
    },
    {
      match: 'zucchina',
      tasks: [
        {
          range: [7, 12],
          title: 'Controlla germogli',
          description: 'Assicura una buona umidità e rimuovi le erbacce.',
          color: 'yellow',
          icon: '🟡',
        },
        { range: [20, 30], title: 'Verifica la fioritura', description: 'Supporta i fiori e controlla l\'irrigazione.', color: 'orange', icon: '🟠' },
        {
          range: [35, null],
          title: 'Inizio raccolta',
          description: 'Controlla i frutti e mantieni il terreno ben drenato.',
          color: 'green',
          icon: '🟢',
        },
      ],
    },
    {
      match: 'insalata',
      tasks: [
        {
          range: [7, 12],
          title: 'Mantieni il terreno umido',
          description: 'Evita stress idrico nelle piantine giovani.',
          color: 'yellow',
          icon: '🟡',
        },
        {
          range: [18, 25],
          title: 'Primo taglio foglie',
          description: 'Raccogli le foglie esterne e lascia crescere il cuore.',
          color: 'orange',
          icon: '🟠',
        },
        {
          range: [30, null],
          title: 'Raccolta regolare',
          description: 'Continua a raccogliere e mantieni spazio libero.',
          color: 'green',
          icon: '🟢',
        },
      ],
    },
  ];

  const cropSet = taskSets.find((item) => name.includes(item.match));
  if (!cropSet) return null;

  const stage = cropSet.tasks.find((entry) => {
    const [min, max] = entry.range;
    if (max === null) return days >= min;
    return days >= min && days <= max;
  });

  if (!stage) return null;

  return {
    id: `${crop.id}-${stage.title.replace(/\s+/g, '-').toLowerCase()}`,
    title: stage.title,
    description: stage.description,
    icon: stage.icon,
    color: stage.color,
  };
}

function getWeatherTasks(weather: Weather) {
  const tasks: AgronomicTask[] = [];

  if (weather.wind > 25) {
    tasks.push({
      id: 'weather-supports',
      icon: '🌬️',
      title: 'Controlla i sostegni',
      description: 'Vento forte > 25 km/h: verifica i supporti delle piante.',
      color: 'red',
    });
  }

  if (weather.humidity > 85) {
    tasks.push({
      id: 'weather-fungal-risk',
      icon: '💧',
      title: 'Rischio fungino',
      description: 'Umidità elevata: controlla le foglie e riduci i ristagni.',
      color: 'blue',
    });
  }

  if (weather.temp > 32) {
    tasks.push({
      id: 'weather-irrigation',
      icon: '🔥',
      title: 'Irrigazione consigliata',
      description: 'Temperatura oltre 32°C: annaffia la sera e mantieni il terreno umido.',
      color: 'red',
    });
  }

  const rainCodes = [61, 63, 65, 80, 81, 82, 95, 96, 99];
  const isHeavyRain = rainCodes.includes(weather.weatherCode) || (weather.condition === 'rain' && weather.humidity > 80);

  if (isHeavyRain) {
    tasks.push({
      id: 'weather-stagnation',
      icon: '🌧️',
      title: 'Attenzione ristagni',
      description: 'Pioggia intensa: controlla il drenaggio per evitare ristagni.',
      color: 'blue',
    });
  }

  if (tasks.length === 0) {
    tasks.push({
      id: 'weather-ideal',
      icon: '✅',
      title: 'Condizioni ideali',
      description: 'Il meteo è buono: sfrutta la giornata per le attività programmate.',
      color: 'green',
    });
  }

  return tasks;
}

function getSeasonalTask(season: string, weather: Weather | null): AgronomicTask | null {
  if (!weather) return null;

  if (season === 'estate' && weather.temp >= 28) {
    return {
      id: 'season-irrigation',
      icon: '💧',
      title: "Estate: controlla l'irrigazione",
      description: 'Con il caldo estivo mantieni umido il terreno senza esagerare con i ristagni.',
      color: 'blue',
    };
  }

  if (season === 'primavera' && weather.temp >= 20) {
    return {
      id: 'season-spring',
      icon: '🌿',
      title: 'Primavera favorevole',
      description: 'Sfrutta il clima mite per monitorare l\'attecchimento e la crescita iniziale.',
      color: 'green',
    };
  }

  if (season === 'autunno' && weather.humidity > 70) {
    return {
      id: 'season-autumn',
      icon: '🍂',
      title: 'Autunno: valuta la protezione',
      description: 'Controlla le piante prima delle piogge più frequenti e previeni i ristagni.',
      color: 'blue',
    };
  }

  return null;
}

function sortTasks(tasks: AgronomicTask[]) {
  const priority: Record<AgronomicTaskColor, number> = {
    red: 0,
    orange: 1,
    blue: 2,
    yellow: 3,
    green: 4,
  };

  return [...tasks].sort((a, b) => priority[a.color] - priority[b.color]);
}

function dedupeTasks(tasks: AgronomicTask[]) {
  const unique = tasks.reduce<Record<string, AgronomicTask>>((acc, task) => {
    if (!acc[task.id]) {
      acc[task.id] = task;
    }
    return acc;
  }, {});

  return Object.values(unique);
}

export function generateCropAgronomicTasks(crop: Crop, weather: Weather | null) {
  const today = new Date();
  const season = getSeason(today);
  const tasks: AgronomicTask[] = [];

  const age = getCropAge(crop);
  const cropTask = createCropTask(crop, age);
  if (cropTask) {
    tasks.push(cropTask);
  }

  if (weather) {
    tasks.push(...getWeatherTasks(weather));
    const seasonalTask = getSeasonalTask(season, weather);
    if (seasonalTask) {
      tasks.push(seasonalTask);
    }
  }

  return sortTasks(dedupeTasks(tasks)).slice(0, 3);
}

export function generateAgronomicTasks(crops: Crop[], weather: Weather | null) {
  const today = new Date();
  const season = getSeason(today);
  const tasks: AgronomicTask[] = [];

  for (const crop of crops) {
    const age = getCropAge(crop);
    const cropTask = createCropTask(crop, age);
    if (cropTask) {
      tasks.push(cropTask);
    }
  }

  if (weather) {
    tasks.push(...getWeatherTasks(weather));
    const seasonalTask = getSeasonalTask(season, weather);
    if (seasonalTask) {
      tasks.push(seasonalTask);
    }
  }

  return sortTasks(dedupeTasks(tasks)).slice(0, 3);
}
