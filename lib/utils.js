import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export const getEmbedUrl = (url) => {
  if (!url) return '';

  if (url.includes('/embed/')) return url;

  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return url;
};

export const normalizeYouTubeUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) {
    const videoId = url.split('/embed/')[1].split('?')[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return url;
};
