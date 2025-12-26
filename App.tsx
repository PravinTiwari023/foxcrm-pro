import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Navigation/Sidebar';
import { MobileNav } from './components/Navigation/MobileNav';
import { AnimatedPage } from './components/AnimatedPage';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { Pipeline } from './pages/Pipeline';
import { FollowUp } from './pages/FollowUp';
import { LeadDetail } from './pages/LeadDetail';
import { LeadForm } from './pages/LeadForm';
import { AddFollowUp } from './pages/AddFollowUp';
import { DealDetail } from './pages/DealDetail';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import logo from './assets/logo.png';
import { initializeAnalytics, trackPageView } from './lib/firebase';

// Loading spinner component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg shadow-orange-500/30 mb-4">
        <img src={logo} alt="FoxCRM" className="w-10 h-10" />
      </div>
      <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mt-4" />
    </div>
  </div>
);

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

// Layout shell component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Desktop Sidebar - fixed position */}
      <Sidebar />

      {/* Main Content Area - uses margin to clear sidebar on desktop */}
      <main className="md:ml-64 min-h-screen relative z-0">
        {children}
      </main>

      {/* Mobile Navigation - fixed bottom */}
      <MobileNav />
    </div>
  );
};

// Analytics tracker component
const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    const pageName = location.pathname === '/' ? 'Dashboard' :
      location.pathname.split('/').filter(Boolean).map(s =>
        s.charAt(0).toUpperCase() + s.slice(1)
      ).join(' - ');
    trackPageView(pageName);
  }, [location]);

  return null;
};

// Animated Routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <AnalyticsTracker />
      <AnimatedPage key={location.pathname}>
        <Routes location={location}>
          {/* Auth Routes */}
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute>
              <Layout><Leads /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads/new" element={
            <ProtectedRoute>
              <Layout><LeadForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads/:id" element={
            <ProtectedRoute>
              <Layout><LeadDetail /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads/:id/edit" element={
            <ProtectedRoute>
              <Layout><LeadForm /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/leads/:id/follow-up" element={
            <ProtectedRoute>
              <Layout><AddFollowUp /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/pipeline" element={
            <ProtectedRoute>
              <Layout><Pipeline /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/pipeline/:id" element={
            <ProtectedRoute>
              <Layout><DealDetail /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/follow-up" element={
            <ProtectedRoute>
              <Layout><FollowUp /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatedPage>
    </>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    // Initialize analytics and performance monitoring
    initializeAnalytics();
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
