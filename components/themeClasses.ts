// Global theme-aware utility classes
// Usage: Import this file and use the functions to get consistent themed styles

type Theme = 'light' | 'dark';

export const themeClass = {
  // Backgrounds
  bg: {
    primary: (theme: Theme) => theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50',
    secondary: (theme: Theme) => theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white',
    tertiary: (theme: Theme) => theme === 'dark' ? 'bg-[#252830]' : 'bg-gray-100',
    quaternary: (theme: Theme) => theme === 'dark' ? 'bg-[#181b21]' : 'bg-gray-50',
    hover: (theme: Theme) => theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-100',
    button: (theme: Theme) => theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-gray-200',
    buttonHover: (theme: Theme) => theme === 'dark' ? 'hover:bg-[#34373f]' : 'hover:bg-gray-300',
  },
  
  // Text
  text: {
    primary: (theme: Theme) => theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    secondary: (theme: Theme) => theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    tertiary: (theme: Theme) => theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    white: (theme: Theme) => theme === 'dark' ? 'text-white' : 'text-gray-900',
    light: (theme: Theme) => theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
  },
  
  // Borders
  border: {
    default: (theme: Theme) => theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    light: (theme: Theme) => theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
    lighter: (theme: Theme) => theme === 'dark' ? 'border-gray-800' : 'border-gray-100',
  },
  
  // Tables
  table: {
    header: (theme: Theme) => theme === 'dark' ? 'bg-[#1e2129]' : 'bg-gray-50',
    headerText: (theme: Theme) => theme === 'dark' ? 'text-gray-400' : 'text-gray-700',
    row: (theme: Theme) => theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-white',
    rowAlt: (theme: Theme) => theme === 'dark' ? 'bg-[#181b21]' : 'bg-gray-50',
    rowHover: (theme: Theme) => theme === 'dark' ? 'hover:bg-[#1e2129]' : 'hover:bg-gray-50',
    cellText: (theme: Theme) => theme === 'dark' ? 'text-gray-200' : 'text-gray-700',
  },
  
  // Forms
  input: {
    bg: (theme: Theme) => theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white',
    border: (theme: Theme) => theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
    text: (theme: Theme) => theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
    placeholder: (theme: Theme) => theme === 'dark' ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400',
  },
};

// Helper to combine theme classes
export const getTheme = (theme: Theme) => ({
  bg: {
    primary: themeClass.bg.primary(theme),
    secondary: themeClass.bg.secondary(theme),
    tertiary: themeClass.bg.tertiary(theme),
    quaternary: themeClass.bg.quaternary(theme),
    hover: themeClass.bg.hover(theme),
    button: themeClass.bg.button(theme),
    buttonHover: themeClass.bg.buttonHover(theme),
  },
  text: {
    primary: themeClass.text.primary(theme),
    secondary: themeClass.text.secondary(theme),
    tertiary: themeClass.text.tertiary(theme),
    white: themeClass.text.white(theme),
    light: themeClass.text.light(theme),
  },
  border: {
    default: themeClass.border.default(theme),
    light: themeClass.border.light(theme),
    lighter: themeClass.border.lighter(theme),
  },
  table: {
    header: themeClass.table.header(theme),
    headerText: themeClass.table.headerText(theme),
    row: themeClass.table.row(theme),
    rowAlt: themeClass.table.rowAlt(theme),
    rowHover: themeClass.table.rowHover(theme),
    cellText: themeClass.table.cellText(theme),
  },
  input: {
    bg: themeClass.input.bg(theme),
    border: themeClass.input.border(theme),
    text: themeClass.input.text(theme),
    placeholder: themeClass.input.placeholder(theme),
  },
});
