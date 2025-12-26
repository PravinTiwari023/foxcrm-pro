import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { NAV_ITEMS, ICON_MAP } from '../../constants';
import { LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/sign-in');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed left-0 top-0 z-20 transition-colors">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-700">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
          <img src={logo} alt="FoxCRM" className="w-6 h-6" />
        </div>
        <span className="text-slate-800 dark:text-slate-100 font-bold text-xl tracking-tight">Fox<span className="text-orange-600 dark:text-orange-400">CRM</span></span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.iconName];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700">
        <div className="mb-4 flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};
