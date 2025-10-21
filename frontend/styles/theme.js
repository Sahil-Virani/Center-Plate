export const theme = {
  colors: {
    // Primary colors
    primary: {
      main: '#496F5D',
      light: '#6B8E7D',
      dark: '#2F4538',
      contrast: '#FFFFFF',
    },
    // Secondary colors
    secondary: {
      main: '#9DD1F1',
      light: '#B4DCF4',
      dark: '#7AB8E8',
      contrast: '#000000',
    },
    // Background colors
    background: {
      default: '#FFFFFF',
      paper: '#F8F8F8',
      dark: '#EAF5FF',
    },
    // Text colors
    text: {
      primary: '#333333',
      secondary: '#666666',
      disabled: '#999999',
      contrast: '#FFFFFF',
    },
    // Status colors
    status: {
      success: '#4CAF50',
      error: '#F44336',
      warning: '#FFC107',
      info: '#2196F3',
    },
    // Border colors
    border: {
      light: '#E0E0E0',
      main: '#CCCCCC',
      dark: '#999999',
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 5,
    },
  },
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      easeInOut: 'ease-in-out',
      easeOut: 'ease-out',
      easeIn: 'ease-in',
    },
  },
}; 