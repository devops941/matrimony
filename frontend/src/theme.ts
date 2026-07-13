// ─────────────────────────────────────────────────────────────────────────────
// Centralized Theme Configuration
// ─────────────────────────────────────────────────────────────────────────────
// Change the HUE name below to re-skin the app, then update every literal class
// string in this file AND the oklch values in src/index.css to match.
// Classes MUST be written as complete literal strings so Tailwind can detect them.
// ─────────────────────────────────────────────────────────────────────────────

/** @internal Theme hue — update literals below when changing brand color */
const H = {
  primary: 'indigo',
  surface: 'slate',
  success: 'emerald',
  warning: 'amber',
  danger: 'rose',
  info: 'sky',
  male: 'blue',
  female: 'pink',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// PRIMARY (Brand) — Indigo
// ═══════════════════════════════════════════════════════════════════════════
export const Primary = {
  50:  'bg-indigo-50',   100: 'bg-indigo-100',  200: 'bg-indigo-200',
  400: 'bg-indigo-400',  500: 'bg-indigo-500',  600: 'bg-indigo-600',
  700: 'bg-indigo-700',  900: 'bg-indigo-900',  950: 'bg-indigo-950',

  text: {
    100: 'text-indigo-100', 200: 'text-indigo-200', 300: 'text-indigo-300',
    400: 'text-indigo-400', 500: 'text-indigo-500', 600: 'text-indigo-600',
    700: 'text-indigo-700', 900: 'text-indigo-900',
  },
  border: {
    100: 'border-indigo-100', 200: 'border-indigo-200', 400: 'border-indigo-400',
    500: 'border-indigo-500',
  },
  ring: {
    50:  'ring-indigo-50', 100: 'ring-indigo-100', 500: 'ring-indigo-500',
  },
  hover: {
    bg:   { 400: 'hover:bg-indigo-400', 500: 'hover:bg-indigo-500', 600: 'hover:bg-indigo-600', 700: 'hover:bg-indigo-700' },
    text: { 400: 'hover:text-indigo-400', 500: 'hover:text-indigo-500', 600: 'hover:text-indigo-600' },
    border: { 400: 'hover:border-indigo-400', 500: 'hover:border-indigo-500' },
  },
  focus: {
    ring:    'focus:ring-indigo-500',
    border:  'focus:border-indigo-500',
  },
  shadow: {
    '600_25': 'shadow-indigo-600/25',
    '500_35': 'shadow-indigo-500/35',
    '950_30': 'shadow-indigo-950/30',
  },
  hoverShadow: {
    '500_35': 'hover:shadow-indigo-500/35',
  },
  opacity: {
    bg_10:     'bg-indigo-500/10',
    bg_20:     'bg-indigo-500/20',
    bg_60:     'bg-indigo-50/60',
    bg_50:     'bg-indigo-50/50',
    bg_40:     'bg-indigo-50/40',
    bg_600_10: 'bg-indigo-600/10',
    border_20: 'border-indigo-500/20',
    border_30: 'border-indigo-500/30',
    ring_20:   'ring-indigo-500/20',
    ring_50:   'ring-indigo-50/50',
  },
  hoverOpacity: {
    bg_50_50: 'hover:bg-indigo-50/50',
  },
  accent: 'accent-indigo-600',
  fill: {
    400: 'fill-indigo-400',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SURFACE (Neutral) — Slate
// ═══════════════════════════════════════════════════════════════════════════
export const Surface = {
  50:  'bg-slate-50',   100: 'bg-slate-100',  200: 'bg-slate-200',
  300: 'bg-slate-300',  800: 'bg-slate-800',  900: 'bg-slate-900',
  950: 'bg-slate-950',

  text: {
    100: 'text-slate-100', 300: 'text-slate-300', 400: 'text-slate-400',
    500: 'text-slate-500', 600: 'text-slate-600', 700: 'text-slate-700',
    800: 'text-slate-800', 900: 'text-slate-900',
  },
  border: {
    50:  'border-slate-50',   100: 'border-slate-100',  200: 'border-slate-200',
    300: 'border-slate-300',  700: 'border-slate-700',  800: 'border-slate-800',
  },
  hover: {
    bg:   { 50: 'hover:bg-slate-50', 100: 'hover:bg-slate-100', 200: 'hover:bg-slate-200',
            300: 'hover:bg-slate-300', 800: 'hover:bg-slate-800', 900: 'hover:bg-slate-900' },
    text: { 100: 'hover:text-slate-100', 900: 'hover:text-slate-900' },
    border: { 200: 'hover:border-slate-200', 700: 'hover:border-slate-700' },
  },
  opacity: {
    bg_50_50:  'bg-slate-50/50',
    bg_50_60:  'bg-slate-50/60',
    bg_900_40: 'bg-slate-900/40',
    bg_950_40: 'bg-slate-950/40',
    bg_950_60: 'bg-gradient-to-t from-slate-950/60 to-transparent',
    bg_200_60: 'bg-slate-200/60',
    bd_200_80: 'border-slate-200/80',
    bd_200_40: 'border-slate-200/40',
    bd_200_50: 'border-slate-200/50',
    bd_200_60: 'border-slate-200/60',
    bd_800_80: 'border-slate-800/80',
  },
  hoverOpacity: {
    bg_900_40: 'hover:bg-slate-900/40',
  },
  shadow: {
    xs: 'shadow-xs', sm: 'shadow-sm', md: 'shadow-md', lg: 'shadow-lg', xl: 'shadow-2xl',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SUCCESS — Emerald
// ═══════════════════════════════════════════════════════════════════════════
export const Success = {
  50:  'bg-emerald-50',  100: 'bg-emerald-100', 200: 'bg-emerald-200',
  500: 'bg-emerald-500', 600: 'bg-emerald-600', 700: 'bg-emerald-700',

  text: {
    500: 'text-emerald-500', 600: 'text-emerald-600', 700: 'text-emerald-700',
    800: 'text-emerald-800', 900: 'text-emerald-900',
  },
  border: {
    100: 'border-emerald-100', 200: 'border-emerald-200', 300: 'border-emerald-300',
  },
  hover: {
    bg: { 50: 'hover:bg-emerald-50', 100: 'hover:bg-emerald-100', 700: 'hover:bg-emerald-700' },
  },
  focus: {
    ring: 'focus:ring-emerald-500',
  },
  opacity: {
    bg_10: 'bg-emerald-500/10',
    bg_50_50: 'bg-emerald-50/50',
    bg_50_60: 'bg-emerald-50/60',
    shadow_100_20: 'shadow-emerald-100/20',
  },
  ring: { 500: 'ring-emerald-500' },
  fill: { 600: 'fill-emerald-600' },
};

// ═══════════════════════════════════════════════════════════════════════════
// WARNING — Amber
// ═══════════════════════════════════════════════════════════════════════════
export const Warning = {
  50:  'bg-amber-50',  100: 'bg-amber-100', 500: 'bg-amber-500',

  text: {
    400: 'text-amber-400', 500: 'text-amber-500', 600: 'text-amber-600',
    700: 'text-amber-700', 800: 'text-amber-800', 900: 'text-amber-900',
  },
  border: {
    100: 'border-amber-100', 200: 'border-amber-200',
  },
  hover: {
    bg: { 100: 'hover:bg-amber-100' },
  },
  opacity: {
    bg_10: 'bg-amber-500/10',
  },
  fill: { 400: 'fill-amber-400' },
};

// ═══════════════════════════════════════════════════════════════════════════
// DANGER — Rose
// ═══════════════════════════════════════════════════════════════════════════
export const Danger = {
  50:  'bg-rose-50',  100: 'bg-rose-100', 500: 'bg-rose-500',
  600: 'bg-rose-600',

  text: {
    400: 'text-rose-400',  50:  'text-rose-50',  500: 'text-rose-500',
    600: 'text-rose-600', 700: 'text-rose-700', 800: 'text-rose-800',
    900: 'text-rose-900',
  },
  border: {
    100: 'border-rose-100', 200: 'border-rose-200', 500: 'border-rose-500',
  },
  hover: {
    bg: { 50: 'hover:bg-rose-50', 100: 'hover:bg-rose-100', 500: 'hover:bg-rose-500', 600: 'hover:bg-rose-600' },
    text: { 600: 'hover:text-rose-600' },
  },
  opacity: {
    bg_10: 'bg-rose-500/10',
    bg_20: 'bg-rose-500/20',
    border_20: 'border-rose-500/20',
    text_50_40: 'text-rose-50/40',
  },
  shadow: { pink_50_50: 'shadow-pink-50/50' },
};

// ═══════════════════════════════════════════════════════════════════════════
// INFO — Sky
// ═══════════════════════════════════════════════════════════════════════════
export const Info = {
  50:  'bg-sky-50', 100: 'bg-sky-100',

  text: {
    700: 'text-sky-700', 800: 'text-sky-800',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// GENDER — Blue / Pink
// ═══════════════════════════════════════════════════════════════════════════
export const Gender = {
  male: {
    50: 'bg-blue-50', 100: 'border-blue-100', 600: 'bg-blue-600',
    text: { 100: 'text-blue-100', 600: 'text-blue-600', 700: 'text-blue-700' },
  },
  female: {
    50: 'bg-pink-50', 100: 'border-pink-100', 600: 'bg-pink-600',
    text: { 100: 'text-pink-100', 600: 'text-pink-600', 700: 'text-pink-700' },
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// AVATAR GRADIENTS
// ═══════════════════════════════════════════════════════════════════════════
export const AvatarGradients = [
  'from-indigo-600 to-violet-700',
  'from-emerald-600 to-teal-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-sky-600 to-blue-700',
] as const;

// ═══════════════════════════════════════════════════════════════════════════
// STATIC (non-themeable) utility classes
// ═══════════════════════════════════════════════════════════════════════════
export const Static = {
  white: 'bg-white',
  transparent: 'bg-transparent',
  textWhite: 'text-white',
  textBlack: 'text-black',
  borderWhite_10: 'border-white/10',
  borderWhite: 'border-white',
  rounded: {
    sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg',
    xl: 'rounded-xl', '2xl': 'rounded-2xl', '3xl': 'rounded-3xl', full: 'rounded-full',
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CSS VARIABLES (for index.css / shadcn integration)
// ═══════════════════════════════════════════════════════════════════════════
export const CSS_VARS = {
  light: {
    '--background':           'oklch(1 0 0)',
    '--foreground':           'oklch(0.145 0 0)',
    '--card':                 'oklch(1 0 0)',
    '--card-foreground':      'oklch(0.145 0 0)',
    '--popover':              'oklch(1 0 0)',
    '--popover-foreground':   'oklch(0.145 0 0)',
    '--primary':              'oklch(0.511 0.262 276.966)',
    '--primary-foreground':   'oklch(0.985 0 0)',
    '--secondary':            'oklch(0.97 0 0)',
    '--secondary-foreground': 'oklch(0.205 0 0)',
    '--muted':                'oklch(0.97 0 0)',
    '--muted-foreground':     'oklch(0.556 0 0)',
    '--accent':               'oklch(0.962 0.018 272.314)',
    '--accent-foreground':    'oklch(0.398 0.195 277.366)',
    '--destructive':          'oklch(0.577 0.245 27.325)',
    '--border':               'oklch(0.922 0 0)',
    '--input':                'oklch(0.922 0 0)',
    '--ring':                 'oklch(0.585 0.233 277.117)',
    '--sidebar':              'oklch(0.985 0 0)',
    '--sidebar-foreground':   'oklch(0.145 0 0)',
    '--sidebar-primary':      'oklch(0.511 0.262 276.966)',
    '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    '--sidebar-accent':       'oklch(0.962 0.018 272.314)',
    '--sidebar-accent-foreground': 'oklch(0.398 0.195 277.366)',
    '--sidebar-border':       'oklch(0.922 0 0)',
    '--sidebar-ring':         'oklch(0.585 0.233 277.117)',
  } as Record<string, string>,

  dark: {
    '--background':           'oklch(0.145 0 0)',
    '--foreground':           'oklch(0.985 0 0)',
    '--card':                 'oklch(0.205 0 0)',
    '--card-foreground':      'oklch(0.985 0 0)',
    '--popover':              'oklch(0.205 0 0)',
    '--popover-foreground':   'oklch(0.985 0 0)',
    '--primary':              'oklch(0.585 0.233 277.117)',
    '--primary-foreground':   'oklch(0.985 0 0)',
    '--secondary':            'oklch(0.269 0 0)',
    '--secondary-foreground': 'oklch(0.985 0 0)',
    '--muted':                'oklch(0.269 0 0)',
    '--muted-foreground':     'oklch(0.708 0 0)',
    '--accent':               'oklch(0.359 0.144 278.697)',
    '--accent-foreground':    'oklch(0.962 0.018 272.314)',
    '--destructive':          'oklch(0.704 0.191 22.216)',
    '--border':               'oklch(1 0 0 / 10%)',
    '--input':                'oklch(1 0 0 / 15%)',
    '--ring':                 'oklch(0.585 0.233 277.117)',
    '--sidebar':              'oklch(0.205 0 0)',
    '--sidebar-foreground':   'oklch(0.985 0 0)',
    '--sidebar-primary':      'oklch(0.585 0.233 277.117)',
    '--sidebar-primary-foreground': 'oklch(0.985 0 0)',
    '--sidebar-accent':       'oklch(0.269 0 0)',
    '--sidebar-accent-foreground': 'oklch(0.985 0 0)',
    '--sidebar-border':       'oklch(1 0 0 / 10%)',
    '--sidebar-ring':         'oklch(0.585 0.233 277.117)',
  } as Record<string, string>,
};

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE COMPOSITES (common multi-class patterns used across pages)
// ═══════════════════════════════════════════════════════════════════════════
export const Composites = {
  card:      'bg-white rounded-2xl border border-slate-200/80 shadow-xs',
  cardHover: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200',
  cardDark:  'bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm',

  pageHeader: 'border-b border-slate-200 pb-4',

  filterBar: 'bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4',

  filterLabel: 'text-[10px] uppercase tracking-wider font-extrabold text-slate-400',

  sectionDivider: 'border-b border-slate-100',

  navActive: 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/30',

  loginBlurPrimary: 'bg-indigo-500/10 rounded-full blur-3xl pointer-events-none',
  loginBlurDanger:  'bg-rose-500/10 rounded-full blur-3xl pointer-events-none',
} as const;

// Suppress unused variable warning — H documents the active hue palette
void H;
