# Telegram Mini App - Furniture AR

Modern Telegram Mini App built with React and Vite, featuring furniture catalog with AR capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Telegram Integration](#telegram-integration)
- [Development](#development)
- [Build](#build)
- [Documentation](#documentation)

## ✨ Features

### MVP (Current Implementation)
- ✅ Splash Screen with loading animation
- ✅ Home Screen with:
  - User statistics (Items, Views, Likes)
  - Quick action buttons
  - Recent activity feed
- ✅ Telegram WebApp SDK integration
- ✅ Haptic feedback support
- ✅ Theme support (Light/Dark mode)
- ✅ Mock data service
- ✅ Responsive design (320px - 600px)
- ✅ Error boundaries

### Coming Soon
- 🚧 Catalog Screen with search and filters
- 🚧 Item Detail Screen
- 🚧 Favorites functionality
- 🚧 User Profile
- 🚧 Settings
- 🚧 Supabase integration
- 🚧 AR functionality

## 🛠 Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 5.4
- **Routing**: React Router DOM 6.26
- **Telegram SDK**: @telegram-apps/sdk-react 1.1
- **UI Library**: @telegram-apps/telegram-ui 2.1
- **Styling**: CSS Modules / Plain CSS
- **State Management**: React Context API (planned)

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Telegram account (for testing in Telegram)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd furnitureAR
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser at `http://localhost:5173`

### Testing in Telegram

To test the app in Telegram:

1. Create a Telegram Bot using [@BotFather](https://t.me/botfather)
2. Set up the Mini App URL using `/newapp` command
3. Use a tunneling service (ngrok, localtunnel) to expose your local server:
```bash
npx ngrok http 5173
```
4. Set the forwarding URL as your Mini App URL in BotFather

## 📁 Project Structure

```
furnitureAR/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary/
│   │   │   └── ErrorBoundary.jsx
│   │   └── Layout/
│   │       ├── Layout.jsx
│   │       └── Layout.css
│   ├── screens/
│   │   ├── SplashScreen.jsx
│   │   ├── SplashScreen.css
│   │   ├── HomeScreen.jsx
│   │   └── HomeScreen.css
│   ├── hooks/
│   │   └── useTelegramWebApp.js
│   ├── utils/
│   │   └── mockData.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── memory-bank/
│   └── projectbrief.md
├── public/
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

## 📜 Available Scripts

### Development
```bash
npm run dev       # Start development server
```

### Build
```bash
npm run build     # Build for production
npm run preview   # Preview production build
```

### Linting
```bash
npm run lint      # Run ESLint
```

## 📱 Telegram Integration

### WebApp SDK Features

The app uses the following Telegram WebApp SDK features:

- **Theme Support**: Automatic theme adaptation (light/dark)
- **Haptic Feedback**: Touch feedback for better UX
- **Main Button**: Bottom action button (planned)
- **Back Button**: Navigation support (planned)
- **User Data**: Access to Telegram user information

### Custom Hooks

#### `useTelegramWebApp()`
Main hook for Telegram WebApp integration:
```javascript
const { webApp, user, isReady, platform, colorScheme } = useTelegramWebApp();
```

#### `useHapticFeedback()`
Haptic feedback hook:
```javascript
const { impactOccurred, notificationOccurred, selectionChanged } = useHapticFeedback();
```

#### `useMainButton()`
Main button control:
```javascript
const { show, hide, setText, showProgress, hideProgress } = useMainButton();
```

#### `useBackButton(onClick)`
Back button control:
```javascript
useBackButton(() => navigate(-1));
```

## 💻 Development

### Theme Variables

The app uses Telegram theme CSS variables:
- `--tg-theme-bg-color`
- `--tg-theme-text-color`
- `--tg-theme-hint-color`
- `--tg-theme-button-color`
- `--tg-theme-button-text-color`
- `--tg-theme-secondary-bg-color`
- And more...

### Mock Data

Currently using mock data for development. See `src/utils/mockData.js` for available functions:
- `getUserStats()` - User statistics
- `getRecentActivity()` - Recent activity
- `getCatalogItems()` - Catalog items
- `getFavoriteItems()` - Favorite items
- And more...

### Adding New Screens

1. Create screen component in `src/screens/`
2. Create corresponding CSS file
3. Add route in `src/App.jsx`
4. Update navigation in relevant components

## 🏗 Build

To build for production:

```bash
npm run build
```

The build output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## 📚 Documentation

Full project documentation is available in:
- **PRD**: `memory-bank/projectbrief.md` - Complete project requirements
- **Screens**: Detailed screen specifications in PRD
- **API**: Mock API documentation in `src/utils/mockData.js`

## 🎨 Design Guidelines

The app follows these design principles:
- **Mobile-First**: Optimized for mobile devices
- **Telegram Native**: Uses Telegram design guidelines
- **Responsive**: Works on screens from 320px to 600px
- **Accessible**: WCAG 2.1 AA compliant
- **Performance**: Optimized loading and rendering

## 🔧 Configuration

### Vite Config
See `vite.config.js` for build configuration.

### Environment Variables
Create `.env` file for environment-specific variables (see `.env.example`).

## 📝 Code Style

- Use functional components with hooks
- Follow React best practices
- Keep components under 200-300 lines
- Use semantic HTML
- Add ARIA labels for accessibility
- Comment complex logic

## 🐛 Troubleshooting

### App not loading in Telegram
- Check if Telegram WebApp script is loaded
- Verify the Mini App URL in BotFather
- Check browser console for errors

### Theme not applying
- Ensure Telegram WebApp SDK is loaded
- Check if theme variables are defined
- Verify CSS variable usage

### Mock data not loading
- Check browser console for errors
- Verify network requests (should have delays)
- Check component lifecycle

## 🤝 Contributing

This is a private project. If you have access and want to contribute:

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

Private project - All rights reserved.

## 👥 Contact

For questions or support, contact the project maintainer.

---

**Note**: This is an MVP version. Additional features will be implemented in future iterations.
