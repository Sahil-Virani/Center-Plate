import { StyleSheet } from 'react-native';

// Design System
const colors = {
  primary: '#496F5D',
  secondary: '#9DD1F1',
  accent: '#ADD8E6',
  background: '#FFFFFF',
  surface: '#F8F8F8',
  text: {
    primary: '#000100',
    secondary: '#555555',
    light: '#F8F8F8',
    error: '#FF0000'
  },
  border: '#E0E0E0'
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28
  },
  body: {
    fontSize: 16,
    lineHeight: 24
  },
  caption: {
    fontSize: 14,
    lineHeight: 20
  }
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16
};

const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3
  }
};

const globalStyles = StyleSheet.create({
  // Layout
    container: {
        flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
        alignItems: 'center',
    },
  center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  // Typography
  h1: {
    ...typography.h1,
    color: colors.text.primary,
  },
  h2: {
    ...typography.h2,
    color: colors.text.primary,
  },
  h3: {
    ...typography.h3,
    color: colors.text.primary,
    },
  bodyText: {
    ...typography.body,
    color: colors.text.primary,
  },
  captionText: {
    ...typography.caption,
    color: colors.text.secondary,
  },

  // Components
  header: {
    width: '100%',
    height: 80,
    backgroundColor: colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    ...shadows.small,
    },
    button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    ...shadows.small,
    },
    buttonText: {
    color: colors.text.light,
    ...typography.body,
    fontWeight: '600',
    },
    input: {
        width: '100%',
        height: 50,
    borderColor: colors.border,
        borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.background,
    ...typography.body,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.medium,
    },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.small,
      },
  image: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    },
  errorText: {
    color: colors.text.error,
    ...typography.caption,
    marginTop: spacing.xs,
    },
  link: {
    color: colors.accent,
    ...typography.body,
      },
      sectionHeader: {
    ...typography.h3,
    marginBottom: spacing.md,
      },
  noDataText: {
    ...typography.body,
    color: colors.text.secondary,
        textAlign: 'center',
    marginTop: spacing.xl,
  }
});

export default globalStyles;