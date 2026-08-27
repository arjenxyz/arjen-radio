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
 * Represents a music track with associated metadata and cover image.
 */
export interface Track {
  title: string;
  artist: string;
  url: string;
  cover: string; // Path to the cover image or GIF in the /public directory
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

// ============================================================================
// Audio Tracks Data
// ============================================================================

/**
 * List of available music tracks for playback, each with title, artist, audio source, and cover image.
 */
export const TRACKS: Track[] = [
  {
    title: "Happy Life",
    artist: "Created by Arjen",
    url: "/music/song4.mp3",
    cover: "/covers/melodydance.gif"
  },
  {
    title: "Night Drive",
    artist: "Created by Arjen",
    url: "/music/song2.mp3",
    cover: "/covers/melodydance.gif"
  },
  {
    title: "Chill Vibes",
    artist: "Created by Arjen",
    url: "/music/song3.mp3",
    cover: "/covers/melodydance.gif"
  },
  {
    title: "Lofi Study",
    artist: "Created by Arjen",
    url: "/music/song1.mp3",
    cover: "/covers/melodydance.gif"
  },
];

// ============================================================================
// Scene Data
// ============================================================================

/**
 * List of available visual scenes, each with unique backgrounds for day and night modes and a theme color.
 */
export const SCENES: Scene[] = [
  {
    id: "Scene-1",
    name: "Background One",
    bgDay: "/merky/scene-1.gif",
    bgNight: "/merky/scene-1.gif",
    themeColor: "#A0A0A0",
  },
  {
    id: "Scene-2",
    name: "Background Two",
    bgDay: "/merky/scene-4.gif",
    bgNight: "/merky/scene-4.gif",
    themeColor: "#A0A0A0",
  }
];