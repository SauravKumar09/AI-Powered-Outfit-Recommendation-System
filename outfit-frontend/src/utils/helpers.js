import { COLOR_MAP } from './constants';

/**
 * Format price to currency string
 */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/**
 * Get score rating label
 */
export const getScoreRating = (score) => {
  if (score >= 0.85) return { label: 'Excellent', class: 'score-excellent' };
  if (score >= 0.70) return { label: 'Good', class: 'score-good' };
  if (score >= 0.55) return { label: 'Fair', class: 'score-fair' };
  return { label: 'Poor', class: 'score-poor' };
};

/**
 * Get color hex value from color name
 */
export const getColorHex = (colorName) => {
  const normalizedColor = colorName?.toLowerCase().replace(/\s+/g, '_');
  return COLOR_MAP[normalizedColor] || '#CBD5E1';
};

/**
 * Calculate contrast color (black or white) for text on colored background
 */
export const getContrastColor = (hexColor) => {
  if (!hexColor) return '#000000';
  
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

/**
 * Format style label
 */
export const formatStyle = (style) => {
  return style?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';
};

/**
 * Truncate text
 */
export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length) + '...';
};

/**
 * Get placeholder image as inline SVG data URI to avoid external requests.
 */
export const getPlaceholderImage = (category, color) => {
  const colors = {
    top: '#3B82F6',
    bottom: '#8B5CF6',
    footwear: '#F59E0B',
    accessory: '#10B981',
  };
  const bg = colors[category] || '#6B7280';
  const label = capitalize(category || 'Item');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
  <rect width="300" height="300" fill="${bg}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="28" font-family="Arial, sans-serif">${label}</text>
</svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Class name merger utility
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};