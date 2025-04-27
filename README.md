# Vietnam Heritage Frontend

## Project Structure
```
vn-heritage/
├── src/
│   ├── api/                  # API configuration
│   ├── assets/              # Static assets, images
│   ├── components/          # Reusable components
│   │   ├── common/         # Shared components
│   │   ├── Footer/         
│   │   ├── Heritage/       # Heritage related components
│   │   ├── Navigation/     # Navigation components
│   │   └── ToastProvider/  # Toast notifications
│   ├── config/             # App configurations
│   ├── constants/          # Constants and environment vars
│   ├── hooks/             # Custom React hooks
│   ├── layout/            # Layout components
│   ├── lib/               # Library utilities
│   ├── pages/             # Page components
│   ├── routes/            # Route configurations
│   │   ├── index.jsx
│   │   ├── privateRoutes.jsx
│   │   └── publicRoutes.jsx
│   └── store/             # Redux store
│       ├── apis/          # RTK Query API slices
│       ├── selectors/     # Redux selectors
│       └── slices/        # Redux slices
```

## Tech Stack

- **Framework**: React
- **State Management**: Redux Toolkit + RTK Query
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Build Tool**: Vite
- **Code Quality**: ESLint

## Key Features

1. **Authentication**
   - Login/Register
   - Private/Public routes
   - Auth state management

2. **Heritage Management**
   - Heritage listing
   - Heritage details
   - Search and filters
   - Pagination

3. **User Features**
   - Favorites system
   - Knowledge tests
   - Leaderboard
   - Mail notifications

4. **UI Components**
   - Responsive design
   - Toast notifications
   - Common components library

## Getting Started

1. **Installation**
```bash
# Install dependencies
npm install
```

2. **Development**
```bash
# Start development server
npm run dev
```

3. **Build**
```bash
# Create production build
npm run build
```

## Environment Variables (.env)
```env
APP_BACKEND_URL=http://localhost:8017
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## State Management

The project uses Redux Toolkit with the following structure:

- **APIs**: RTK Query API definitions
  - `heritageApi.js` - Heritage related endpoints
  - `authApi.js` - Authentication endpoints
  - `knowledgeTestApi.js` - Knowledge test endpoints
  - `leaderboardApi.js` - Leaderboard endpoints

- **Slices**: Redux state slices
  - `authSlice.js` - Authentication state
  - `favoriteSlice.js` - Favorites management
  - `paginationSlice.js` - Pagination state

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/name`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/name`)
5. Create Pull Request

## License

This project is licensed under the MIT License.
