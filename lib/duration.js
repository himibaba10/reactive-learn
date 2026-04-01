export const durationToSeconds = (duration) => {
  if (typeof duration !== 'string') {
    throw new Error('durationToSeconds function error: Expected a string');
  }

  const parts = duration.split(':').map(Number);
  if (parts.length === 2) {
    const [mm, ss] = parts;
    return mm * 60 + ss;
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }
  return 0;
};

export const secondsToDuration = (seconds) => {
  if (typeof seconds !== 'number') {
    throw new Error('secondsToDuration function error: Expected a number');
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};
