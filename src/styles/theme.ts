export const theme = {
  light: {
    text: {
      primary: 'text-gray-800',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
    },
    paper: 'bg-white/90 backdrop-blur-sm',
    border: 'border-gray-200',
    accent: 'text-indigo-600',
    background: 'bg-gray-50',
    input: {
      background: 'bg-white',
      border: 'border-gray-200',
      focus: 'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
      hover: 'hover:border-indigo-300',
      text: 'text-gray-800 placeholder-gray-400',
    },
    button: {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-400',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
      outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
    },
    listItem: {
      hover: 'hover:bg-gray-50',
    },
  },
  dark: {
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    paper: 'bg-gray-900/90 backdrop-blur-sm',
    border: 'border-gray-800',
    accent: 'text-indigo-400',
    background: 'bg-gray-900',
    input: {
      background: 'bg-gray-800',
      border: 'border-gray-700',
      focus: 'focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:outline-none',
      hover: 'hover:border-indigo-500',
      text: 'text-gray-100 placeholder-gray-500',
    },
    button: {
      primary: 'bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700 disabled:bg-indigo-400',
      secondary: 'bg-gray-800 text-gray-200 hover:bg-gray-700 active:bg-gray-600',
      outline: 'border border-gray-700 text-gray-300 hover:bg-gray-800/50 active:bg-gray-700',
    },
    listItem: {
      hover: 'hover:bg-gray-800/50',
    },
  },
  common: {
    rounded: 'rounded-lg',
    shadow: 'shadow-lg shadow-gray-900/5',
    button: 'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    input: 'px-4 py-2 rounded-lg transition-colors duration-200',
  }
} as const;
