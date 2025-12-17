import plugin from 'tailwindcss/plugin';

/**
 * Blimu Tailwind CSS Plugin
 *
 * This plugin extends Tailwind with Blimu-specific design tokens and utilities.
 * It injects CSS variables and extends the theme with the Blimu color palette.
 *
 * @example
 * ```javascript
 * // tailwind.config.js
 * import { blimuPlugin } from '@blimu/react/tailwind';
 *
 * export default {
 *   plugins: [blimuPlugin],
 * };
 * ```
 */
export const blimuPlugin: ReturnType<typeof plugin> = plugin(
  ({ addBase, theme }) => {
    // Inject CSS variables as base styles
    addBase({
      ':root': {
        '--blimu-background': 'oklch(1 0 0)',
        '--blimu-foreground': 'oklch(0.145 0 0)',
        '--blimu-card': 'oklch(1 0 0)',
        '--blimu-card-foreground': 'oklch(0.145 0 0)',
        '--blimu-popover': 'oklch(1 0 0)',
        '--blimu-popover-foreground': 'oklch(0.145 0 0)',
        '--blimu-primary': 'oklch(0.5 0.2 270)',
        '--blimu-primary-foreground': 'oklch(0.985 0 0)',
        '--blimu-secondary': 'oklch(0.97 0 0)',
        '--blimu-secondary-foreground': 'oklch(0.205 0 0)',
        '--blimu-muted': 'oklch(0.97 0 0)',
        '--blimu-muted-foreground': 'oklch(0.556 0 0)',
        '--blimu-accent': 'oklch(0.97 0 0)',
        '--blimu-accent-foreground': 'oklch(0.205 0 0)',
        '--blimu-destructive': 'oklch(0.577 0.245 27.325)',
        '--blimu-destructive-foreground': 'oklch(0.577 0.245 27.325)',
        '--blimu-border': 'oklch(0.922 0 0)',
        '--blimu-input': 'oklch(0.922 0 0)',
        '--blimu-ring': 'oklch(0.4 0 0)',
        '--blimu-chart-1': 'oklch(0.646 0.222 41.116)',
        '--blimu-chart-2': 'oklch(0.6 0.118 184.704)',
        '--blimu-chart-3': 'oklch(0.398 0.07 227.392)',
        '--blimu-chart-4': 'oklch(0.828 0.189 84.429)',
        '--blimu-chart-5': 'oklch(0.769 0.188 70.08)',
        '--blimu-radius': '0.625rem',
        '--blimu-sidebar': 'oklch(0.985 0 0)',
        '--blimu-sidebar-foreground': 'oklch(0.145 0 0)',
        '--blimu-sidebar-primary': 'oklch(0.205 0 0)',
        '--blimu-sidebar-primary-foreground': 'oklch(0.985 0 0)',
        '--blimu-sidebar-accent': 'oklch(0.97 0 0)',
        '--blimu-sidebar-accent-foreground': 'oklch(0.205 0 0)',
        '--blimu-sidebar-border': 'oklch(0.922 0 0)',
        '--blimu-sidebar-ring': 'oklch(0.708 0 0)',
      },
      '.dark': {
        '--blimu-background': 'oklch(0.145 0 0)',
        '--blimu-foreground': 'oklch(0.985 0 0)',
        '--blimu-card': 'oklch(0.145 0 0)',
        '--blimu-card-foreground': 'oklch(0.985 0 0)',
        '--blimu-popover': 'oklch(0.22 0 0)',
        '--blimu-popover-foreground': 'oklch(0.985 0 0)',
        '--blimu-primary': 'oklch(0.65 0.2 270)',
        '--blimu-primary-foreground': 'oklch(0.985 0 0)',
        '--blimu-secondary': 'oklch(0.269 0 0)',
        '--blimu-secondary-foreground': 'oklch(0.985 0 0)',
        '--blimu-muted': 'oklch(0.269 0 0)',
        '--blimu-muted-foreground': 'oklch(0.708 0 0)',
        '--blimu-accent': 'oklch(0.269 0 0)',
        '--blimu-accent-foreground': 'oklch(0.985 0 0)',
        '--blimu-destructive': 'oklch(0.396 0.141 25.723)',
        '--blimu-destructive-foreground': 'oklch(0.637 0.237 25.331)',
        '--blimu-border': 'oklch(0.269 0 0)',
        '--blimu-input': 'oklch(0.269 0 0)',
        '--blimu-ring': 'oklch(0.7 0 0)',
        '--blimu-chart-1': 'oklch(0.488 0.243 264.376)',
        '--blimu-chart-2': 'oklch(0.696 0.17 162.48)',
        '--blimu-chart-3': 'oklch(0.769 0.188 70.08)',
        '--blimu-chart-4': 'oklch(0.627 0.265 303.9)',
        '--blimu-chart-5': 'oklch(0.645 0.246 16.439)',
        '--blimu-sidebar': 'oklch(0.205 0 0)',
        '--blimu-sidebar-foreground': 'oklch(0.985 0 0)',
        '--blimu-sidebar-primary': 'oklch(0.488 0.243 264.376)',
        '--blimu-sidebar-primary-foreground': 'oklch(0.985 0 0)',
        '--blimu-sidebar-accent': 'oklch(0.269 0 0)',
        '--blimu-sidebar-accent-foreground': 'oklch(0.985 0 0)',
        '--blimu-sidebar-border': 'oklch(0.269 0 0)',
        '--blimu-sidebar-ring': 'oklch(0.439 0 0)',
      },
    });
  },
  {
    // Extend Tailwind with Blimu-specific utilities
    theme: {
      extend: {
        colors: {
          // Top-level aliases matching Shadcn pattern (for compatibility)
          background: 'oklch(var(--blimu-background))',
          foreground: 'oklch(var(--blimu-foreground))',
          card: {
            DEFAULT: 'oklch(var(--blimu-card))',
            foreground: 'oklch(var(--blimu-card-foreground))',
          },
          popover: {
            DEFAULT: 'oklch(var(--blimu-popover))',
            foreground: 'oklch(var(--blimu-popover-foreground))',
          },
          primary: {
            DEFAULT: 'oklch(var(--blimu-primary))',
            foreground: 'oklch(var(--blimu-primary-foreground))',
          },
          secondary: {
            DEFAULT: 'oklch(var(--blimu-secondary))',
            foreground: 'oklch(var(--blimu-secondary-foreground))',
          },
          muted: {
            DEFAULT: 'oklch(var(--blimu-muted))',
            foreground: 'oklch(var(--blimu-muted-foreground))',
          },
          accent: {
            DEFAULT: 'oklch(var(--blimu-accent))',
            foreground: 'oklch(var(--blimu-accent-foreground))',
          },
          destructive: {
            DEFAULT: 'oklch(var(--blimu-destructive))',
            foreground: 'oklch(var(--blimu-destructive-foreground))',
          },
          border: 'oklch(var(--blimu-border))',
          input: 'oklch(var(--blimu-input))',
          ring: 'oklch(var(--blimu-ring))',
          // Scoped Blimu colors (preferred for explicit scoping)
          blimu: {
            background: 'oklch(var(--blimu-background))',
            foreground: 'oklch(var(--blimu-foreground))',
            card: {
              DEFAULT: 'oklch(var(--blimu-card))',
              foreground: 'oklch(var(--blimu-card-foreground))',
            },
            popover: {
              DEFAULT: 'oklch(var(--blimu-popover))',
              foreground: 'oklch(var(--blimu-popover-foreground))',
            },
            primary: {
              DEFAULT: 'oklch(var(--blimu-primary))',
              foreground: 'oklch(var(--blimu-primary-foreground))',
            },
            secondary: {
              DEFAULT: 'oklch(var(--blimu-secondary))',
              foreground: 'oklch(var(--blimu-secondary-foreground))',
            },
            muted: {
              DEFAULT: 'oklch(var(--blimu-muted))',
              foreground: 'oklch(var(--blimu-muted-foreground))',
            },
            accent: {
              DEFAULT: 'oklch(var(--blimu-accent))',
              foreground: 'oklch(var(--blimu-accent-foreground))',
            },
            destructive: {
              DEFAULT: 'oklch(var(--blimu-destructive))',
              foreground: 'oklch(var(--blimu-destructive-foreground))',
            },
            border: 'oklch(var(--blimu-border))',
            input: 'oklch(var(--blimu-input))',
            ring: 'oklch(var(--blimu-ring))',
            chart: {
              1: 'oklch(var(--blimu-chart-1))',
              2: 'oklch(var(--blimu-chart-2))',
              3: 'oklch(var(--blimu-chart-3))',
              4: 'oklch(var(--blimu-chart-4))',
              5: 'oklch(var(--blimu-chart-5))',
            },
            sidebar: {
              DEFAULT: 'oklch(var(--blimu-sidebar))',
              foreground: 'oklch(var(--blimu-sidebar-foreground))',
              primary: {
                DEFAULT: 'oklch(var(--blimu-sidebar-primary))',
                foreground: 'oklch(var(--blimu-sidebar-primary-foreground))',
              },
              accent: {
                DEFAULT: 'oklch(var(--blimu-sidebar-accent))',
                foreground: 'oklch(var(--blimu-sidebar-accent-foreground))',
              },
              border: 'oklch(var(--blimu-sidebar-border))',
              ring: 'oklch(var(--blimu-sidebar-ring))',
            },
          },
        },
        borderRadius: {
          blimu: 'var(--blimu-radius)',
          'blimu-sm': 'calc(var(--blimu-radius) - 4px)',
          'blimu-md': 'calc(var(--blimu-radius) - 2px)',
          'blimu-lg': 'var(--blimu-radius)',
          'blimu-xl': 'calc(var(--blimu-radius) + 4px)',
        },
      },
    },
    // Safelist critical animation classes
    content: [
      'animate-in',
      'animate-out',
      'fade-in-0',
      'fade-out-0',
      'zoom-in-95',
      'zoom-out-95',
      'slide-in-from-top',
      'slide-in-from-bottom',
      'slide-in-from-left',
      'slide-in-from-right',
    ],
  },
);
