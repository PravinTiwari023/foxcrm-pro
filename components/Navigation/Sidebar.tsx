import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, ICON_MAP } from '../../constants';
import { LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed left-0 top-0 z-20 transition-colors">
      <div className="p-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">R</span>
        </div>
        <span className="text-slate-800 dark:text-slate-100 font-bold text-xl tracking-tight">RealEstate<span className="text-blue-600 dark:text-blue-400">CRM</span></span>
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
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400'
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
        <button className="flex items-center gap-3 w-full px-3 py-2 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
        <div className="mt-4 flex items-center gap-3 px-2">
          <img src="https://picsum.photos/40/40" alt="User" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-600" />
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Jane Realtor</span>
            <span className="text-[10px] text-slate-400">jane@agency.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};