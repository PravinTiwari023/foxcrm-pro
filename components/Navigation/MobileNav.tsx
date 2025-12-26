import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS, ICON_MAP } from '../../constants';

export const MobileNav: React.FC = () => {
  return (
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
                ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}
              `}
            >
              <Icon className="w-6 h-6" strokeWidth={2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};