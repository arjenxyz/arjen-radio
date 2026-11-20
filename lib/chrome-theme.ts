/**
 * Shared day/night chrome tokens for bars, clock, menus, and modals.
 * Night → soft dark panels · Day → light panels
 */
export function getChromeTheme(isDayMode: boolean) {
  if (isDayMode) {
    return {
      isDay: true as const,
      panel: 'bg-white/95 border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.18)]',
      panelSolid: 'bg-white border-black/10 shadow-[0_12px_40px_rgba(0,0,0,0.22)]',
      panelBg: '#ffffff',
      header: 'border-black/5 bg-black/[0.03]',
      text: 'text-neutral-900',
      soft: 'text-neutral-600',
      muted: 'text-neutral-500',
      faint: 'text-neutral-400',
      icon: 'text-neutral-500 hover:text-neutral-900',
      iconIdle: 'text-neutral-400 hover:text-neutral-900',
      iconActive: 'text-neutral-900',
      border: 'border-black/10',
      borderSubtle: 'border-black/5',
      surface: 'bg-black/[0.04]',
      surfaceStrong: 'bg-black/[0.06]',
      divider: 'bg-black/10',
      close: 'bg-black/5 hover:bg-black/10 text-neutral-500 hover:text-neutral-900',
      toggleTrack: 'bg-black/10 border-black/10 hover:border-black/20',
      toggleActive: 'bg-neutral-900 text-white',
      toggleIdle: 'text-neutral-400',
      itemBorder: 'border-black/10',
      itemBorderIdle: 'border-black/5',
      itemSelected: 'border-neutral-900 shadow-[0_0_15px_rgba(0,0,0,0.08)]',
      itemTitle: 'text-neutral-900',
      itemTitleIdle: 'text-neutral-700',
      livePill: 'bg-white/90 border-black/10 text-neutral-700 hover:bg-white',
      clockPanel:
        'bg-white/92 border-black/10 hover:bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]',
      clockTime: 'text-neutral-900',
      clockDate: 'text-neutral-600',
      clockDateStrong: 'text-neutral-900',
      backdrop: 'bg-black/20',
    };
  }

  return {
    isDay: false as const,
    // Original solid night chrome
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
      'bg-[#0a0a0a]/80 border-white/10 hover:bg-[#0a0a0a]/90 shadow-2xl',
    clockTime: 'text-white',
    clockDate: 'text-gray-300',
    clockDateStrong: 'text-white',
    backdrop: 'bg-black/30',
  };
}

export type ChromeTheme = ReturnType<typeof getChromeTheme>;
