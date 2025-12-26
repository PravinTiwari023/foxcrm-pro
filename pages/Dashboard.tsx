import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, Clock, CheckCircle, Users,
  PhoneCall, ArrowRight, Phone, MessageCircle,
  IndianRupee, Plus, ChevronRight, AlertCircle, Briefcase, Sun, Moon,
  Target, Zap, Calendar, ArrowUpRight
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

// --- Main Dashboard Component ---

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { leads, deals, tasks, loading } = useData();

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Metrics Calculation
  const pipelineValue = deals.reduce((acc, deal) => acc + deal.numericValue, 0);
  const hotLeadsCount = leads.filter(l => l.temperature === 'Hot').length;
  const closingsThisMonth = deals.filter(d =>
    d.stage === 'closed' &&
    d.lastTouch.includes('Just now') // Simplified for demo, ideally check date
  ).length;

  const upcomingTasks = tasks.filter(t => !t.isOverdue && t.status !== 'completed').slice(0, 3);
  const newLeads = leads.filter(l => l.status === 'New').slice(0, 3);

  // Pipeline Progress Helpers
  const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage);
  const getStageTotal = (stage: string) => getDealsByStage(stage).reduce((acc, curr) => acc + curr.numericValue, 0);
  const pipelineTotal = pipelineValue || 1; // Avoid div by zero

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* --- Header --- */}
      <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">{getGreeting()}, {user?.displayName?.split(' ')[0] || 'User'}</h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">

        {/* Hero Stats Section - Mobile First */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-4 md:p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {/* Main Stat - Commission */}
            <div className="col-span-2 md:col-span-1 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">YTD Earnings</span>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">₹0</p>
              <div className="flex items-center gap-1 mt-2">
                <span className="text-xs font-medium text-slate-400">Track your success</span>
              </div>
            </div>

            {/* Pipeline */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-[10px] font-medium text-slate-400 uppercase">Pipeline</span>
              </div>
              <p className="text-xl font-bold text-white">{formatCurrency(pipelineValue)}</p>
              <p className="text-[10px] text-slate-400 mt-1">{deals.length} Active Deals</p>
            </div>

            {/* Hot Leads */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-[10px] font-medium text-slate-400 uppercase">Hot Leads</span>
              </div>
              <p className="text-xl font-bold text-white">{hotLeadsCount}</p>
              <p className="text-[10px] text-slate-400 mt-1">Need Attention</p>
            </div>

            {/* Closings */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-medium text-slate-400 uppercase">Closings</span>
              </div>
              <p className="text-xl font-bold text-white">{closingsThisMonth}</p>
              <p className="text-[10px] text-slate-400 mt-1">This Month</p>
            </div>
          </div>
        </div>

        {/* Quick Actions - Horizontal Scroll on Mobile */}
        <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            <button
              onClick={() => navigate('/leads')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-sm font-medium whitespace-nowrap hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> New Lead
            </button>
            <button
              onClick={() => navigate('/follow-up')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <CheckCircle className="w-4 h-4" /> Add Task
            </button>
            <button
              onClick={() => navigate('/pipeline')}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <TrendingUp className="w-4 h-4" /> Pipeline
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">

          {/* Today's Priority - Full Width Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <Zap className="w-4 h-4 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Today's Priority</h3>
              </div>
              <button
                onClick={() => navigate('/follow-up')}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"
              >
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {upcomingTasks.length > 0 ? upcomingTasks.map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {item.leadName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.leadName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${item.isOverdue ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {item.displayTime}
                    </span>
                    <button className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No priority tasks for today!
                </div>
              )}
            </div>
          </div>

          {/* Two Column Layout for Desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

            {/* Pipeline Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">Pipeline Progress</h3>
                </div>
                <button
                  onClick={() => navigate('/pipeline')}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  Board <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {[
                  { stage: 'negotiation', label: 'Negotiation', color: 'bg-blue-500' },
                  { stage: 'documentation', label: 'Under Contract', color: 'bg-amber-500' },
                  { stage: 'payment', label: 'Closing', color: 'bg-emerald-500' }
                ].map((item, i) => {
                  const stageTotal = getStageTotal(item.stage);
                  const percent = (stageTotal / pipelineTotal) * 100;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{item.label}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{formatCurrency(stageTotal)}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New Leads */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">New Leads</h3>
                  <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{newLeads.length} NEW</span>
                </div>
                <button
                  onClick={() => navigate('/leads')}
                  className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  All <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {newLeads.length > 0 ? newLeads.map((item, i) => (
                  <div key={i} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer" onClick={() => navigate('/leads')}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{item.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">{item.source} • {item.budget}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                )) : (
                  <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                    No new leads yet.
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* System Notice Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Welcome to FoxCRM!</p>
                <p className="text-blue-100 text-xs">Your production dashboard is ready.</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-lg transition-colors backdrop-blur-sm">
              Do More
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
