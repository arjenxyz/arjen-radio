/**
 * Shared day/night chrome tokens for bars, clock, menus, and modals.
 * Night → soft dark panels · Day → light panels
 */
export function getChromeTheme(isDayMode: boolean) {
  if (isDayMode) {
    return {
      isDay: true as const,
      // Fully opaque white so bright scenes cannot wash out chrome
      panel: 'bg-white border-black/15 shadow-[0_12px_40px_rgba(0,0,0,0.22)]',
      panelSolid: 'bg-white border-black/15 shadow-[0_16px_44px_rgba(0,0,0,0.28)]',
      panelBg: '#ffffff',
      header: 'border-black/10 bg-neutral-100',
      text: 'text-neutral-950',
      soft: 'text-neutral-700',
      muted: 'text-neutral-600',
      faint: 'text-neutral-500',
      icon: 'text-neutral-700 hover:text-neutral-950',
      iconIdle: 'text-neutral-600 hover:text-neutral-950',
      iconActive: 'text-neutral-950',
      border: 'border-black/15',
      borderSubtle: 'border-black/10',
      surface: 'bg-neutral-100',
      surfaceStrong: 'bg-neutral-200/80',
      divider: 'bg-black/15',
      close: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-950',
      toggleTrack: 'bg-neutral-100 border-black/15 hover:border-black/25',
      toggleActive: 'bg-neutral-950 text-white',
      toggleIdle: 'text-neutral-500',
      itemBorder: 'border-black/15',
      itemBorderIdle: 'border-black/10',
      itemSelected: 'border-neutral-950 shadow-[0_0_15px_rgba(0,0,0,0.1)]',
      itemTitle: 'text-neutral-950',
      itemTitleIdle: 'text-neutral-700',
      livePill: 'bg-white border-black/15 text-neutral-800 hover:bg-neutral-50',
      clockPanel:
        'border-black/10 bg-white/92 shadow-[0_12px_40px_rgba(0,0,0,0.22)] backdrop-blur-md hover:bg-white',
      clockTime: 'text-neutral-950',
      clockDate: 'text-neutral-700',
      clockDateStrong: 'text-neutral-950',
      backdrop: 'bg-black/25',
      accentOnPanel: '#4A6BB5',
    };
  }

  return {
    isDay: false as const,
    panel: 'bg-[#121212]/95 border-white/10 shadow-2xl',
    panelSolid: 'bg-[#121212] border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.75)]',
    panelBg: '#121212',
    header: 'border-white/5 bg-white/5',
    text: 'text-white',
    soft: 'text-gray-300',
    muted: 'text-gray-500',
    faint: 'text-white/40',
    icon: 'text-white/60 hover:text-white',
    iconIdle: 'text-white/40 hover:text-white',
    iconActive: 'text-white',
    border: 'border-white/10',
    borderSubtle: 'border-white/5',
    surface: 'bg-white/5',
    surfaceStrong: 'bg-black/20',
    divider: 'bg-[#222]',
    close: 'bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white',
    toggleTrack: 'bg-black/30 border-white/5 hover:border-white/20',
    toggleActive: 'bg-white text-black',
    toggleIdle: 'text-gray-500',
    itemBorder: 'border-white/20',
    itemBorderIdle: 'border-white/5',
    itemSelected: 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]',
    itemTitle: 'text-white',
    itemTitleIdle: 'text-gray-300',
    livePill: 'bg-black/40 border-white/10 text-gray-300 hover:bg-black/55',
    clockPanel:
      'border-white/10 bg-black/70 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-md hover:bg-black/75',
    clockTime: 'text-white',
    clockDate: 'text-gray-300',
    clockDateStrong: 'text-white',
    backdrop: 'bg-black/30',
    accentOnPanel: '#9BB4E8',
  };
}

export type ChromeTheme = ReturnType<typeof getChromeTheme>;
