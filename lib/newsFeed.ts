export type NewsFeedItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
  category: string;
  highlight: string;
};

const mockNewsFeed: NewsFeedItem[] = [
  {
    id: 'weather-1',
    icon: '⛅',
    title: 'Meteo agricolo instabile',
    description: 'Nuove perturbazioni porteranno piogge leggere nelle regioni centrali. Proteggi le colture sensibili.',
    category: 'Meteo agricolo',
    highlight: 'Vento e umidità',
  },
  {
    id: 'disease-1',
    icon: '🦠',
    title: 'Corna del cavolo: attenzione',
    description: 'Monitora le foglie inferiori dei cavoli. L’umidità elevata favorisce la marcescenza.',
    category: 'Malattie orto',
    highlight: 'Controllo rapido',
  },
  {
    id: 'fertilizer-1',
    icon: '🌿',
    title: 'Concimi naturali consigliati',
    description: 'Passa a compost maturo e tè di ortica per un nutrimento equilibrato e sostenibile.',
    category: 'Concimi',
    highlight: 'Biologico',
  },
  {
    id: 'irrigation-1',
    icon: '💧',
    title: 'Irrigazione serale ideale',
    description: 'Annaffia alla sera per ridurre l’evaporazione e mantenere il terreno fresco più a lungo.',
    category: 'Irrigazione',
    highlight: 'Risparmio idrico',
  },
  {
    id: 'moon-1',
    icon: '🌙',
    title: 'Luna crescente favorevole',
    description: 'La fase di luna crescente è ottima per lavori sulle parti aeree delle piante.',
    category: 'Luna agricola',
    highlight: 'Potatura e semina',
  },
  {
    id: 'insects-1',
    icon: '🐞',
    title: 'Insetti utili in crescita',
    description: 'Coccinelle e api sono più attive: mantieni fiori di campo per attirarle.',
    category: 'Insetti',
    highlight: 'Biodiversità verde',
  },
  {
    id: 'harvest-1',
    icon: '🧺',
    title: 'Raccolti precoci',
    description: 'Pomodori e zucchine sono pronti a dare frutti ricchi: raccogli regolarmente.',
    category: 'Raccolti',
    highlight: 'Raccolta continua',
  },
  {
    id: 'season-1',
    icon: '🍂',
    title: 'Stagionalità: pronto l’orto d’autunno',
    description: 'Prepara il terreno per le semine autunnali, scegli colture resistenti e ricche di nutrienti.',
    category: 'Stagionalità',
    highlight: 'Pianifica ora',
  },
  {
    id: 'organic-1',
    icon: '🌼',
    title: 'Agricoltura biologica semplice',
    description: 'Usa pacciamatura naturale e rotazione delle colture per limitare i parassiti senza pesticidi.',
    category: 'Agricoltura biologica',
    highlight: 'Orto sano',
  },
];

export function getNewsFeedItems(): NewsFeedItem[] {
  return mockNewsFeed;
}
