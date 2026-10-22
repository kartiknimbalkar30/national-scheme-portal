// ============================================================
// theme.js — National Scheme Portal Design System
// Ha file सगळ्या pages madhe import karायचा, ani sagle colors/
// styles ithунच घ्यायचे. Consistency राखण्यासाठी आणि repeat
// code टाळण्यासाठी.
//
// Vaparण्याची पद्धत (कुठल्याही page मध्ये):
//   import { colors, typography, styles } from '../theme';
//   ...
//   <div style={styles.card}> ... </div>
//   <button style={styles.buttonPrimary}>Save</button>
// ============================================================

// ---------- 1. COLOR PALETTE ----------
export const colors = {
  // Primary — deep trustworthy navy (Government feel)
  navy: '#0B2545',
  navyDark: '#071A33',
  navyLight: '#13376B',

  // Secondary blue (links, secondary actions)
  blue: '#1565C0',
  blueLight: '#E3F2FD',

  // Accent — warm saffron/orange (India flag inspired, CTA color)
  saffron: '#EF6C00',
  saffronDark: '#C55A00',
  saffronLight: '#FFF3E0',

  // Status colors
  success: '#2E7D32',
  successBg: '#E8F5E9',
  error: '#C62828',
  errorBg: '#FDECEA',
  warning: '#F9A825',
  warningBg: '#FFF8E1',

  // Neutrals
  bgPage: '#F4F6F9',          // overall page background
  bgCard: '#FFFFFF',          // card/panel background
  border: '#E0E4EA',
  borderFocus: '#1565C0',

  textPrimary: '#0F1B2D',
  textSecondary: '#5A6472',
  textMuted: '#8A93A0',
  textOnDark: '#FFFFFF'
};

// ---------- 2. TYPOGRAPHY ----------
// index.html madhe ha Google Fonts link add kar (<head> madhe):
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

export const typography = {
  headingFont: `'Poppins', 'Segoe UI', sans-serif`,
  bodyFont: `'Inter', 'Segoe UI', sans-serif`,

  h1: { fontFamily: `'Poppins', sans-serif`, fontSize: '2rem', fontWeight: '700', lineHeight: '1.25' },
  h2: { fontFamily: `'Poppins', sans-serif`, fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.3' },
  h3: { fontFamily: `'Poppins', sans-serif`, fontSize: '1.15rem', fontWeight: '600', lineHeight: '1.35' },
  body: { fontFamily: `'Inter', sans-serif`, fontSize: '1rem', fontWeight: '400', lineHeight: '1.55' },
  small: { fontFamily: `'Inter', sans-serif`, fontSize: '0.85rem', fontWeight: '400', lineHeight: '1.4' }
};

// ---------- 3. SPACING SCALE ----------
export const spacing = {
  xs: '6px',
  sm: '12px',
  md: '20px',
  lg: '32px',
  xl: '48px'
};

// ---------- 4. SHADOWS & RADIUS ----------
export const radius = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  pill: '999px'
};

export const shadow = {
  sm: '0 1px 3px rgba(11, 37, 69, 0.08)',
  md: '0 4px 16px rgba(11, 37, 69, 0.10)',
  lg: '0 8px 30px rgba(11, 37, 69, 0.14)'
};

// ---------- 5. REUSABLE COMPONENT STYLES ----------
export const styles = {

  // ===== Page wrapper =====
  pageWrapper: {
    minHeight: '100vh',
    background: colors.bgPage,
    padding: spacing.lg,
    fontFamily: typography.body.fontFamily
  },

  // ===== Card / Panel =====
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.xl,
    boxShadow: shadow.md,
    border: `1px solid ${colors.border}`
  },

  // ===== Header banner (gradient navy) used at top of forms/pages =====
  headerBanner: {
    background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
    borderRadius: radius.md,
    padding: `${spacing.md} ${spacing.lg}`,
    color: colors.textOnDark,
    textAlign: 'center',
    marginBottom: spacing.lg
  },

  // ===== Section heading (used inside forms, e.g. "Personal Information") =====
  sectionHeading: {
    ...typography.h3,
    color: colors.navy,
    marginBottom: spacing.sm,
    borderBottom: `2px solid ${colors.blueLight}`,
    paddingBottom: spacing.xs
  },

  // ===== Inputs =====
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: spacing.xs,
    borderRadius: radius.sm,
    border: `1px solid ${colors.border}`,
    fontSize: '1rem',
    fontFamily: typography.body.fontFamily,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    color: colors.textPrimary
  },

  inputFocus: {
    border: `1px solid ${colors.borderFocus}`,
    boxShadow: `0 0 0 3px rgba(21, 101, 192, 0.15)`
  },

  inputError: {
    border: `2px solid ${colors.error}`,
    backgroundColor: colors.errorBg
  },

  errorText: {
    color: colors.error,
    fontSize: '0.8rem',
    marginTop: '0',
    marginBottom: spacing.sm,
    fontWeight: '500'
  },

  // ===== Buttons =====
  buttonPrimary: {
    width: '100%',
    padding: '14px',
    backgroundColor: colors.saffron,
    color: colors.textOnDark,
    border: 'none',
    borderRadius: radius.sm,
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: typography.headingFont,
    cursor: 'pointer',
    letterSpacing: '0.3px',
    boxShadow: shadow.sm,
    transition: 'all 0.2s ease-in-out'
  },

  buttonPrimaryHover: {
    backgroundColor: colors.saffronDark,
    transform: 'translateY(-1px)',
    boxShadow: shadow.md
  },

  buttonSecondary: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'transparent',
    color: colors.navy,
    border: `2px solid ${colors.navy}`,
    borderRadius: radius.sm,
    fontSize: '1rem',
    fontWeight: '600',
    fontFamily: typography.headingFont,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out'
  },

  buttonDanger: {
    padding: '10px 18px',
    backgroundColor: colors.error,
    color: colors.textOnDark,
    border: 'none',
    borderRadius: radius.sm,
    fontSize: '0.9rem',
    fontWeight: '600',
    cursor: 'pointer'
  },

  // ===== Badges / Status pills =====
  badgeSuccess: {
    display: 'inline-block',
    backgroundColor: colors.successBg,
    color: colors.success,
    padding: '4px 12px',
    borderRadius: radius.pill,
    fontSize: '0.8rem',
    fontWeight: '600'
  },

  badgeWarning: {
    display: 'inline-block',
    backgroundColor: colors.warningBg,
    color: colors.warning,
    padding: '4px 12px',
    borderRadius: radius.pill,
    fontSize: '0.8rem',
    fontWeight: '600'
  },

  // ===== Alert / Message banners =====
  alertSuccess: {
    backgroundColor: colors.successBg,
    color: colors.success,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '600'
  },

  alertError: {
    backgroundColor: colors.errorBg,
    color: colors.error,
    padding: spacing.sm,
    borderRadius: radius.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
    fontWeight: '600'
  },

  // ===== Navbar =====
  navbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    padding: `${spacing.sm} ${spacing.lg}`,
    boxShadow: shadow.sm,
    borderBottom: `3px solid ${colors.saffron}`
  },

  navLink: {
    color: colors.textPrimary,
    textDecoration: 'none',
    fontWeight: '500',
    fontFamily: typography.body.fontFamily,
    padding: '8px 14px',
    borderRadius: radius.sm,
    transition: 'all 0.15s ease-in-out'
  },

  navLinkActive: {
    color: colors.blue,
    backgroundColor: colors.blueLight
  }
};

// ---------- 6. HELPER FUNCTIONS ----------
// Form field cha style deto — error asel tar red, focus asel tar blue highlight
export const getInputStyle = (fieldName, errors = {}, focusedField = '') => ({
  ...styles.input,
  ...(errors[fieldName] ? styles.inputError : {}),
  ...(focusedField === fieldName && !errors[fieldName] ? styles.inputFocus : {})
});