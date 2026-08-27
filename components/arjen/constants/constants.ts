import { ARJEN_COLORS } from '@/lib/branding';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents an ambient sound option with its metadata and default settings.
 */
export interface AmbientSound {
  id: string;
  name: string;
  src: string;
  defaultValue: number;
  position: { top: string; left: string };
}

/**
 * Represents a visual scene with day/night backgrounds and a theme color.
 */
export interface Scene {
  id: string;
  name: string;
  bgDay: string;
  bgNight: string;
  themeColor: string;
}

/** Local images from public/atmosphere/ — add or swap files there to customize. */
const local = (file: string) => `/atmosphere/${encodeURIComponent(file)}`;

// ============================================================================
// Scene Data — user-provided wallpapers from public/atmosphere/
// ============================================================================

export const SCENES: Scene[] = [
  {
    id: 'mountain-cat',
    name: 'Mountain Cat',
    bgDay: local('asthetic wallpaper.jpg'),
    bgNight: local('asthetic wallpaper.jpg'),
    themeColor: ARJEN_COLORS.accent,
  },
  {
    id: 'adventure-stars',
    name: 'Adventure Stars',
    bgDay: local('fondo playyy.jpg'),
    bgNight: local('fondo playyy.jpg'),
    themeColor: ARJEN_COLORS.violet,
  },
  {
    id: 'space-cats',
    name: 'Space Cats',
    bgDay: local('funny crazy cats wallpaper.jpg'),
    bgNight: local('funny crazy cats wallpaper.jpg'),
    themeColor: ARJEN_COLORS.accentDark,
  },
  {
    id: 'patrick-moon',
    name: 'Patrick Moon',
    bgDay: local('indir.jpg'),
    bgNight: local('indir.jpg'),
    themeColor: '#6B9EBF',
  },
  {
    id: 'rick-lab',
    name: "Rick's Lab",
    bgDay: local('indir (1).jpg'),
    bgNight: local('indir (1).jpg'),
    themeColor: '#5BCEFA',
  },
  {
    id: 'pony-party',
    name: 'Pony Party',
    bgDay: local('indir (2).jpg'),
    bgNight: local('indir (2).jpg'),
    themeColor: '#9BB4E8',
  },
  {
    id: 'pixel-hills',
    name: 'Pixel Hills',
    bgDay: local('indir (3).jpg'),
    bgNight: local('indir (3).jpg'),
    themeColor: '#7B8FD4',
  },
  {
    id: 'shrek-forest',
    name: 'Shrek Forest',
    bgDay: local('indir (4).jpg'),
    bgNight: local('indir (4).jpg'),
    themeColor: '#5E8F6E',
  },
  {
    id: 'lock-in',
    name: 'Lock In',
    bgDay: local('lock in now wallpaper.jpg'),
    bgNight: local('lock in now wallpaper.jpg'),
    themeColor: ARJEN_COLORS.accent,
  },
  {
    id: 'minecraft-coast',
    name: 'Minecraft Coast',
    bgDay: local('Minecraft - Wallpaper for Windows.jpg'),
    bgNight: local('Minecraft - Wallpaper for Windows.jpg'),
    themeColor: '#4FA3C4',
  },
  {
    id: 'rick-sunset',
    name: "Rick's Sunset",
    bgDay: local("Rick and morty's wallpaper.jpg"),
    bgNight: local("Rick and morty's wallpaper.jpg"),
    themeColor: ARJEN_COLORS.violet,
  },
  {
    id: 'tablet-screen',
    name: 'Tablet Screen',
    bgDay: local('tablet ekranı.jpg'),
    bgNight: local('tablet ekranı.jpg'),
    themeColor: ARJEN_COLORS.accentLight,
  },
  {
    id: 'school-of-athens',
    name: 'School of Athens',
    bgDay: local('The School of Athens.jpg'),
    bgNight: local('The School of Athens.jpg'),
    themeColor: '#8B7CC8',
  },
  {
    id: 'serio-bunito',
    name: 'Serio e Bunito',
    bgDay: local('walpaper serio e bunito🤠👍.jpg'),
    bgNight: local('walpaper serio e bunito🤠👍.jpg'),
    themeColor: ARJEN_COLORS.accentDark,
  },
];

export const SCENE_FALLBACK_GRADIENT =
  'linear-gradient(135deg, #6B8FD9 0%, #8B7CC8 45%, #4FA3C4 100%)';
