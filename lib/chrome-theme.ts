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
    // Soft dark, mostly opaque — readable over busy wallpapers
    panel: 'bg-[#1c1c20]/92 border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
    panelSolid: 'bg-[#1c1c20] border-white/12 shadow-[0_16px_48px_rgba(0,0,0,0.55)]',
    panelBg: '#1c1c20',
    header: 'border-white/10 bg-white/[0.04]',
    text: 'text-white',
    soft: 'text-zinc-200',
    muted: 'text-zinc-400',
    faint: 'text-white/50',
    icon: 'text-white/75 hover:text-white',
    iconIdle: 'text-white/50 hover:text-white',
    iconActive: 'text-white',
    border: 'border-white/12',
    borderSubtle: 'border-white/10',
    surface: 'bg-white/[0.06]',
    surfaceStrong: 'bg-white/[0.08]',
    divider: 'bg-white/10',
    close: 'bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white',
    toggleTrack: 'bg-white/10 border-white/10 hover:border-white/25',
    toggleActive: 'bg-white text-zinc-900',
    toggleIdle: 'text-zinc-400',
    itemBorder: 'border-white/25',
    itemBorderIdle: 'border-white/10',
    itemSelected: 'border-white shadow-[0_0_15px_rgba(255,255,255,0.12)]',
    itemTitle: 'text-white',
    itemTitleIdle: 'text-zinc-200',
    livePill: 'bg-[#1c1c20]/85 border-white/12 text-zinc-200 hover:bg-[#25252b]',
    clockPanel:
      'bg-[#1c1c20]/88 border-white/12 hover:bg-[#1c1c20]/95 shadow-[0_12px_40px_rgba(0,0,0,0.35)]',
    clockTime: 'text-white',
    clockDate: 'text-zinc-300',
    clockDateStrong: 'text-white',
    backdrop: 'bg-black/25',
  };
}

export type ChromeTheme = ReturnType<typeof getChromeTheme>;
