# HRMS Lite Frontend

React + Vite frontend for HRMS Lite application.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## Pages

- `/` - Dashboard with statistics
- `/employees` - Employee management
- `/attendance` - Attendance tracking

## Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Features

- React 18 with Hooks
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Responsive design
- Form validation
- Error handling
- Loading states
