# @blimu/react

React components and hooks for [Blimu](https://blimu.dev) authentication and authorization.

## Features

- 🔐 **Drop-in Authentication Components** - Pre-built UI components like `UserButton`
- 🎨 **Fully Customizable** - Theme system with CSS variables and className overrides
- 🌓 **Dark Mode Support** - Built-in light and dark theme variants
- 🎯 **TypeScript First** - Complete type safety with IntelliSense support
- ⚡ **Tailwind CSS v4** - Modern CSS-first configuration
- 🪝 **React Hooks** - `useAuth`, `useUser`, and more
- 🧩 **Headless UI** - Built on Radix UI primitives

## Installation

```bash
npm install @blimu/react
# or
yarn add @blimu/react
# or
pnpm add @blimu/react
```

### Peer Dependencies

This library requires:
- `react` ^18.0.0 || ^19.0.0
- `react-dom` ^18.0.0 || ^19.0.0
- `tailwindcss` ^4.0.0 (optional, but recommended)

## Quick Start

### 1. Wrap your app with BlimuProvider

```tsx
import { BlimuProvider } from '@blimu/react';
import '@blimu/react/styles';

function App() {
  return (
    <BlimuProvider publishableKey="pk_...">
      <YourApp />
    </BlimuProvider>
  );
}
```

### 2. Use authentication components

```tsx
import { UserButton } from '@blimu/react';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <UserButton />
    </header>
  );
}
```

### 3. Access authentication state

```tsx
import { useAuth, useUser } from '@blimu/react';

function Dashboard() {
  const { isAuthenticated, login, logout } = useAuth();
  const { user } = useUser();

  if (!isAuthenticated) {
    return <button onClick={() => login()}>Sign In</button>;
  }

  return (
    <div>
      <h1>Welcome, {user?.firstName}!</h1>
      <button onClick={() => logout()}>Sign Out</button>
    </div>
  );
}
```

## Styling & Customization

### Default Setup (with Tailwind CSS v4)

If you're using Tailwind CSS v4, import the stylesheet in your app:

```tsx
import '@blimu/react/styles';
```

This gives you the default Blimu theme with dark mode support.

### Theme Customization

#### Option 1: Theme Prop (Easiest)

Customize colors and border radius via the `theme` prop:

```tsx
<BlimuProvider
  publishableKey="pk_..."
  theme={{
    colors: {
      primary: 'oklch(0.5 0.2 250)',      // Custom blue
      background: '#ffffff',              // Hex colors work too
      foreground: 'rgb(0, 0, 0)',         // Or RGB
    },
    radius: 'lg',  // 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | custom CSS value
  }}
>
  <YourApp />
</BlimuProvider>
```

#### Option 2: CSS Variables (Maximum Control)

Override CSS variables in your global styles:

```css
/* your-app.css */
:root {
  --blimu-primary: oklch(0.45 0.25 264);
  --blimu-primary-foreground: oklch(1 0 0);
  --blimu-radius: 0.5rem;
  /* See full list of variables below */
}

.dark {
  --blimu-primary: oklch(0.7 0.2 264);
  --blimu-background: oklch(0.15 0 0);
}
```

**Available CSS Variables:**

```css
/* Colors */
--blimu-background
--blimu-foreground
--blimu-card
--blimu-card-foreground
--blimu-popover
--blimu-popover-foreground
--blimu-primary
--blimu-primary-foreground
--blimu-secondary
--blimu-secondary-foreground
--blimu-muted
--blimu-muted-foreground
--blimu-accent
--blimu-accent-foreground
--blimu-destructive
--blimu-destructive-foreground
--blimu-border
--blimu-input
--blimu-ring

/* Border Radius */
--blimu-radius
```

#### Option 3: className Overrides (Component Level)

Every component accepts `className` and `classes` props:

```tsx
<UserButton
  className="custom-user-button"
  classes={{
    trigger: 'hover:scale-105 transition-transform',
    avatar: 'ring-2 ring-blue-500',
    popover: 'shadow-2xl',
    userName: 'font-bold',
  }}
  onManageAccount={() => router.push('/settings')}
/>
```

### Dark Mode

Blimu components automatically support dark mode when a `.dark` class is present on any parent element:

```tsx
// Using next-themes
import { ThemeProvider } from 'next-themes';

<ThemeProvider attribute="class">
  <BlimuProvider publishableKey="pk_...">
    <YourApp />
  </BlimuProvider>
</ThemeProvider>
```

Or manually:

```tsx
<div className="dark">
  <BlimuProvider publishableKey="pk_...">
    <YourApp />
  </BlimuProvider>
</div>
```

## Components

### UserButton

A button that displays the current user's avatar and provides account management options.

```tsx
import { UserButton } from '@blimu/react';

<UserButton
  className="custom-class"
  classes={{
    trigger: 'hover:opacity-90',
    avatar: 'ring-2 ring-primary',
    popover: 'shadow-xl',
    userName: 'font-semibold',
    manageAccountButton: 'hover:bg-accent',
    signOutButton: 'hover:bg-destructive/10',
  }}
  onManageAccount={() => {
    // Navigate to account settings
  }}
/>
```

**Props:**
- `className?: string` - Custom class for the root element
- `classes?: object` - Object of classes for sub-elements
- `onManageAccount?: () => void` - Callback when "Manage account" is clicked

### RedirectToSignIn

Redirects unauthenticated users to the sign-in page.

```tsx
import { RedirectToSignIn } from '@blimu/react';

function ProtectedPage() {
  return (
    <>
      <RedirectToSignIn returnUrl="/dashboard" />
      <Dashboard />
    </>
  );
}
```

## Hooks

### useAuth

Access authentication state and methods.

```tsx
import { useAuth } from '@blimu/react';

function Component() {
  const {
    state,              // Full auth state object
    isAuthenticated,    // Boolean
    isLoading,          // Boolean
    login,              // (returnUrl?) => void
    logout,             // () => Promise<void>
    getToken,           // (options) => Promise<string | null>
  } = useAuth();
}
```

### useUser

Get the current user object.

```tsx
import { useUser } from '@blimu/react';

function Profile() {
  const { user } = useUser();

  return (
    <div>
      <h1>{user?.firstName} {user?.lastName}</h1>
      <p>{user?.email}</p>
    </div>
  );
}
```

**User object:**
```ts
interface User {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  emailVerified: boolean;
}
```

### useBlimu

Access the Blimu client and configuration.

```tsx
import { useBlimu } from '@blimu/react';

function Component() {
  const { client, config } = useBlimu();
}
```

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  User,
  AuthState,
  BlimuConfig,
  BlimuTheme,
  BlimuThemeColors,
  UserButtonProps,
} from '@blimu/react';

// Type-safe theme configuration
const theme: BlimuTheme = {
  colors: {
    primary: 'oklch(0.5 0.2 250)',
  },
  radius: 'lg',
};

// Component props are fully typed
const userButtonProps: UserButtonProps = {
  className: 'my-button',
  onManageAccount: () => console.log('Account'),
};
```

## Framework Guides

### Next.js (App Router)

```tsx
// app/layout.tsx
import { BlimuProvider } from '@blimu/react';
import '@blimu/react/styles';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BlimuProvider publishableKey={process.env.NEXT_PUBLIC_BLIMU_PUBLISHABLE_KEY!}>
          {children}
        </BlimuProvider>
      </body>
    </html>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import { BlimuProvider } from '@blimu/react';
import '@blimu/react/styles';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BlimuProvider publishableKey={process.env.NEXT_PUBLIC_BLIMU_PUBLISHABLE_KEY!}>
      <Component {...pageProps} />
    </BlimuProvider>
  );
}
```

### Vite + React

```tsx
// main.tsx
import { BlimuProvider } from '@blimu/react';
import '@blimu/react/styles';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BlimuProvider publishableKey={import.meta.env.VITE_BLIMU_PUBLISHABLE_KEY}>
    <App />
  </BlimuProvider>
);
```

### Remix

```tsx
// app/root.tsx
import { BlimuProvider } from '@blimu/react';
import styles from '@blimu/react/styles';

export const links = () => [
  { rel: 'stylesheet', href: styles },
];

export default function Root() {
  return (
    <html>
      <head>
        <Links />
      </head>
      <body>
        <BlimuProvider publishableKey={process.env.BLIMU_PUBLISHABLE_KEY!}>
          <Outlet />
        </BlimuProvider>
      </body>
    </html>
  );
}
```

## Advanced Usage

### Protected Routes

```tsx
import { useAuth, RedirectToSignIn } from '@blimu/react';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}
```

### Getting Tokens

```tsx
import { useAuth } from '@blimu/react';

function ApiCall() {
  const { getToken } = useAuth();

  const fetchData = async () => {
    const token = await getToken({ template: 'web' });

    const response = await fetch('/api/data', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
```

### Custom Components

Build your own components using the hooks:

```tsx
import { useUser, useAuth } from '@blimu/react';

function CustomUserMenu() {
  const { user } = useUser();
  const { logout } = useAuth();

  if (!user) return null;

  return (
    <div className="menu">
      <img src={user.avatarUrl} alt={user.firstName} />
      <span>{user.email}</span>
      <button onClick={logout}>Sign Out</button>
    </div>
  );
}
```

## Examples

See the [examples directory](../../examples) for complete working examples:

- Next.js App Router
- Next.js Pages Router
- Vite + React
- Remix
- Custom styling examples

## Troubleshooting

### Tailwind classes not working

Make sure you've imported the styles:

```tsx
import '@blimu/react/styles';
```

If you're using Tailwind CSS v4 in your app, the Blimu components will inherit your Tailwind configuration.

### Dark mode not working

Ensure a `.dark` class is added to a parent element:

```tsx
<div className="dark">
  <BlimuProvider>...</BlimuProvider>
</div>
```

### TypeScript errors

Make sure `@blimu/react` is installed and your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "jsx": "react-jsx"
  }
}
```

## API Reference

Full API documentation available at [docs.blimu.dev](https://docs.blimu.dev)

## License

MIT

## Support

- Documentation: [docs.blimu.dev](https://docs.blimu.dev)
- Issues: [GitHub Issues](https://github.com/blimu/blimu/issues)
- Discord: [Join our community](https://discord.gg/blimu)
