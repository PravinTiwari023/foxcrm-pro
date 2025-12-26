import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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


// Animated Routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatedPage key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/leads/new" element={<LeadForm />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/leads/:id/edit" element={<LeadForm />} />
        <Route path="/leads/:id/follow-up" element={<AddFollowUp />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/pipeline/:id" element={<DealDetail />} />
        <Route path="/follow-up" element={<FollowUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatedPage>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </HashRouter>
  );
};


export default App;