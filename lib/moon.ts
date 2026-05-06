export const getMoonPhase = (date = new Date()) => {
  const lp = 2551443;
  const now = Math.floor(date.getTime() / 1000);
  const new_moon = 1732968000;

  const phase = ((now - new_moon) % lp) / lp;
  const daysIntoCycle = phase * 29.53;

  let label = "";
  let isGrowing = false;

  if (daysIntoCycle < 1.84) label = "Luna Nuova";
  else if (daysIntoCycle < 7.38) { label = "Luna Crescente"; isGrowing = true; }
  else if (daysIntoCycle < 12.92) { label = "Primo Quarto"; isGrowing = true; }
  else if (daysIntoCycle < 16.61) { label = "Luna Piena"; isGrowing = false; }
  else if (daysIntoCycle < 22.15) { label = "Luna Calante"; isGrowing = false; }
  else if (daysIntoCycle < 27.68) { label = "Ultimo Quarto"; isGrowing = false; }
  else label = "Luna Nuova";

  return { label, isGrowing, daysIntoCycle };
};