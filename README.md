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
│   │   ├── Home/           # Home components
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

1. **Heritage Exploration**

   - View heritage list and details
   - Interactive Google Maps integration
   - Search nearby heritage sites
   - View detailed information and images

2. **User Features**

   - Take knowledge tests
   - View personal rankings
   - Rate and review heritage sites
   - Ask and answer questions about heritage sites

3. **Admin Features**
   - User management
   - Heritage site management
   - Quiz management

## Getting Started

1. **Installation**

```bash
npm install
```

2. **Development**

```bash
npm run dev
```

## Environment Variables (.env)

```env
APP_BACKEND_URL=http://localhost:8017
```

### 🌐 Deployed Link

[👉 Truy cập website tại đây](https://heritage.thuandev.id.vn)

## License

This project is licensed under the MIT License.
