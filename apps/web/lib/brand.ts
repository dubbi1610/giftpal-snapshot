/**
 * GiftPal Brand Configuration
 * Centralized brand constants for consistent theming across the app
 */

export const brandColors = {
  primary: {
    main: '#FF6B9D',
    light: '#FF8FA3',
    dark: '#E55A87',
  },
  secondary: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#8B5CF6',
  },
  accent: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  neutral: {
    dark: '#1F2937',
    medium: '#6B7280',
    light: '#F3F4F6',
    lighter: '#F9FAFB',
    white: '#FFFFFF',
  },
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

export const brandTypography = {
  fontFamily: {
    sans: 'var(--font-inter), "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    mono: '"SF Mono", Menlo, "Courier New", monospace',
  },
  fontSize: {
    hero: '3.5rem',
    title: '2rem',
    subtitle: '1.25rem',
    body: '1.0625rem',
    small: '0.875rem',
    tiny: '0.75rem',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.2,
    relaxed: 1.47059,
  },
  letterSpacing: {
    tight: '-0.03em',
    normal: '-0.02em',
    relaxed: '-0.01em',
  },
} as const;

export const brandSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
} as const;

export const brandShadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)',
  brand: '0 4px 12px rgba(255, 107, 157, 0.35)',
  glass: '0 4px 30px rgba(255, 107, 157, 0.1)',
} as const;

export const brandBorderRadius = {
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  '2xl': '2rem',
  full: '9999px',
} as const;

export const brandTransitions = {
  fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// Brand logo paths
export const brandAssets = {
  logo: '/brand/logos/logo.svg',
  icon: '/brand/logos/icon.svg',
  favicon: '/favicon.ico',
} as const;

// Export all brand config
export const brandConfig = {
  colors: brandColors,
  typography: brandTypography,
  spacing: brandSpacing,
  shadows: brandShadows,
  borderRadius: brandBorderRadius,
  transitions: brandTransitions,
  assets: brandAssets,
} as const;

export default brandConfig;
