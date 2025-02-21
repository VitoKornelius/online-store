import React from 'react';
import AppRoutes from './routes';
import { AuthProvider } from "./contexts/AuthContext"; // Імпортуємо AuthProvider

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;

