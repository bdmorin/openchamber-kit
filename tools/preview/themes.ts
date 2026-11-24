// OpenChamber's own theme tokens as the host hands them to extension frames
// (HostReadyContext.theme.tokens), taken from the built-in openchamber-dark
// and openchamber-light themes of OpenChamber 2.8.0. The *Text colours are the
// host's computed readable tints, approximated here.
export type ThemeTokens = Record<string, string>;

const fonts = {
  font: '-apple-system, "SF Pro Text", Inter, system-ui, sans-serif',
  fontSize: '14px',
  mono: 'Menlo, ui-monospace, monospace',
  radius: '0.5625rem',
};

export const dark: ThemeTokens = {
  ...fonts,
  background: '#120f0e', elevated: '#1b1918', foreground: '#ebe7dc', muted: '#9a978d', subtle: '#171616',
  border: '#242323bf', hover: '#ffffff0f', selection: '#c8c6c52b', focus: '#da7c4755', primary: '#da7c47',
  mutedSurface: '#0e0c0b', elevatedForeground: '#ebe7dc', active: '#ffffff1a', selectionForeground: '#ebe7dc',
  primaryForeground: '#ffffff', primaryText: '#e8915f', successText: '#8cc266', warningText: '#d99a3c',
  errorText: '#e67868', infoText: '#6cb3ec', success: '#76ad4f', warning: '#c67f13', error: '#da5b4a', info: '#479fe6',
  syntaxType: '#479cb1',
};

export const light: ThemeTokens = {
  ...dark,
  background: '#fdfcfa', elevated: '#f3f2f0', foreground: '#262521', muted: '#696960', subtle: '#f7f6f4',
  border: '#e5e1debf', hover: '#0000000a', selection: '#26252120', focus: '#b3501755', primary: '#b35017',
  mutedSurface: '#f7f6f4', elevatedForeground: '#262521', active: '#00000014', selectionForeground: '#262521',
  primaryText: '#a34a14', successText: '#4a6c2f', warningText: '#7a5e10', errorText: '#a8423a', infoText: '#2a66ae',
  success: '#517734', warning: '#886914', error: '#b7493f', info: '#2c6ebd', syntaxType: '#2f7d8f',
};

export const themes = { dark, light } as const;
export type ThemeName = keyof typeof themes;
