export const getThemeClasses = (theme: 'light' | 'dark') => ({
  // Backgrounds
  bgPrimary: theme === 'dark' ? 'bg-[#1a1d24]' : 'bg-gray-50',
  bgSecondary: theme === 'dark' ? 'bg-[#1e2129]' : 'bg-white',
  bgTertiary: theme === 'dark' ? 'bg-[#252830]' : 'bg-gray-100',
  bgHover: theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-50',
  
  // Text
  textPrimary: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
  textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
  textMuted: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
  
  // Borders
  border: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  borderLight: theme === 'dark' ? 'border-gray-800' : 'border-gray-100',
  
  // Inputs
  inputBg: theme === 'dark' ? 'bg-[#2a2d35]' : 'bg-white',
  inputBorder: theme === 'dark' ? 'border-gray-600' : 'border-gray-300',
  inputText: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
  inputPlaceholder: theme === 'dark' ? 'placeholder:text-gray-500' : 'placeholder:text-gray-400',
  
  // Tables
  tableHeader: theme === 'dark' ? 'bg-[#1e2129] text-gray-400' : 'bg-gray-50 text-gray-700',
  tableRow: theme === 'dark' ? 'bg-[#1a1d24] hover:bg-[#1e2129]' : 'bg-white hover:bg-gray-50',
  tableRowAlt: theme === 'dark' ? 'bg-[#1e2129] hover:bg-[#252830]' : 'bg-gray-50 hover:bg-gray-100',
  tableBorder: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
  
  // Cards
  card: theme === 'dark' ? 'bg-[#1e2129] border-gray-700' : 'bg-white border-gray-200',
  cardHover: theme === 'dark' ? 'hover:bg-[#252830]' : 'hover:bg-gray-50',
});
