import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, ICON_MAP } from '../../constants';
import { User, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const MobileNav: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/sign-in');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <>
      {/* Profile Modal */}
      {showProfile && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setShowProfile(false)}
          />
          <div className="fixed bottom-20 left-4 right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl z-[70] p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Profile</h3>
              <button
                onClick={() => setShowProfile(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {user?.displayName || 'User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-3 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl font-medium"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </>
      )}

      {/* Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 z-50 pb-[env(safe-area-inset-bottom)] transition-colors">
        <div className="flex justify-around items-center h-16">
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName];
            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) => `
                  flex flex-col items-center justify-center w-full h-full gap-1
                  ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400 dark:text-slate-500'}
                `}
              >
                <Icon className="w-6 h-6" strokeWidth={2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={() => setShowProfile(true)}
            className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-400 dark:text-slate-500"
          >
            <User className="w-6 h-6" strokeWidth={2} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
