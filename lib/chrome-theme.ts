/**
 * Shared day/night chrome tokens for bars, clock, menus, and modals.
 * Night → soft dark panels · Day → light panels
 */
export function getChromeTheme(isDayMode: boolean) {
  if (isDayMode) {
    return {
      isDay: true as const,
      // Frosted glass — scene shows through Travel / menus / bars
      panel:
        'border-black/10 bg-white/45 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-2xl',
      panelSolid:
        'border-black/10 bg-white/45 shadow-[0_16px_44px_rgba(0,0,0,0.2)] backdrop-blur-2xl',
      panelBg: 'rgba(255,255,255,0.45)',
      header: 'border-black/10 bg-white/25',
      text: 'text-neutral-950',
      soft: 'text-neutral-800',
      muted: 'text-neutral-700',
      faint: 'text-neutral-600',
      icon: 'text-neutral-700 hover:text-neutral-950',
      iconIdle: 'text-neutral-600 hover:text-neutral-950',
      iconActive: 'text-neutral-950',
      border: 'border-black/15',
      borderSubtle: 'border-black/10',
      surface: 'bg-white/35',
      surfaceStrong: 'bg-white/50',
      divider: 'bg-black/15',
      close: 'bg-white/50 hover:bg-white/80 text-neutral-700 hover:text-neutral-950',
      toggleTrack: 'bg-white/40 border-black/15 hover:border-black/25',
      toggleActive: 'bg-neutral-950 text-white',
      toggleIdle: 'text-neutral-500',
      itemBorder: 'border-black/15',
      itemBorderIdle: 'border-black/10',
      itemSelected: 'border-neutral-950 shadow-[0_0_15px_rgba(0,0,0,0.1)]',
      itemTitle: 'text-neutral-950',
      itemTitleIdle: 'text-neutral-700',
      livePill: 'bg-white/55 border-black/15 text-neutral-800 hover:bg-white/75',
      clockPanel:
        'border-black/10 bg-white/55 shadow-[0_12px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl hover:bg-white/70',
      clockTime: 'text-neutral-950',
      clockDate: 'text-neutral-700',
      clockDateStrong: 'text-neutral-950',
      backdrop: 'bg-black/25',
      accentOnPanel: '#4A6BB5',
    };
  }

  return {
    isDay: false as const,
    panel:
      'border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl',
    panelSolid:
      'border-white/10 bg-black/40 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl',
    panelBg: 'rgba(0,0,0,0.4)',
    header: 'border-white/5 bg-white/[0.04]',
    text: 'text-white',
    soft: 'text-gray-300',
    muted: 'text-gray-400',
    faint: 'text-white/40',
    icon: 'text-white/60 hover:text-white',
    iconIdle: 'text-white/40 hover:text-white',
    iconActive: 'text-white',
    border: 'border-white/10',
    borderSubtle: 'border-white/5',
    surface: 'bg-white/5',
    surfaceStrong: 'bg-black/25',
    divider: 'bg-white/10',
    close: 'bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white',
    toggleTrack: 'bg-black/30 border-white/5 hover:border-white/20',
    toggleActive: 'bg-white text-black',
    toggleIdle: 'text-gray-500',
    itemBorder: 'border-white/20',
    itemBorderIdle: 'border-white/5',
    itemSelected: 'border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]',
    itemTitle: 'text-white',
    itemTitleIdle: 'text-gray-300',
    livePill: 'bg-black/35 border-white/10 text-gray-300 hover:bg-black/50',
    clockPanel:
      'border-white/10 bg-black/45 shadow-[0_16px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl hover:bg-black/55',
    clockTime: 'text-white',
    clockDate: 'text-gray-300',
    clockDateStrong: 'text-white',
    backdrop: 'bg-black/30',
    accentOnPanel: '#9BB4E8',
  };
}

export type ChromeTheme = ReturnType<typeof getChromeTheme>;
