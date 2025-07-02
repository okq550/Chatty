import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';

import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SigninPage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Use the useEffect hook to call the checkAuth once the component mounts
  // This is called twice because we have StrictMode in main.jsx
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); //[checkAuth] The empty dependency array [checkAuth] means this effect will run once when the component mounts and whenever the checkAuth function reference changes.
  // is a dependency array that ensures that the effect runs only when the checkAuth function changes.
  // If you want the effect to run only once when the component mounts, you can pass an empty array [].
  // If you want the effect to run on every render, you can pass undefined or omit the dependency array entirely.

  // If checking is in progress and the user is not authenticated, show a loading indicator
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        // Protected route
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/signin" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/signin" element={!authUser ? <SignInPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        // Protected route
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/signin" />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
