import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import MainContent from './components/MainContent';
import AuthCallback from './components/AuthCallback';
import { AuthProvider, useAuth } from './context/AuthContext';

// Main App content with Auth check
const AppContent = () => {
  const { loading } = useAuth();
  
  // Force dark mode for black sky theme
  useEffect(() => {
    // Always use dark mode
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    
    // Prevent switching to light mode
    const observer = new MutationObserver(() => {
      if (!document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.add('dark');
      }
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="App min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="App min-h-screen bg-black">
      <Navbar />
      <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="*" element={<MainContent />} />
      </Routes>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Background3D />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
