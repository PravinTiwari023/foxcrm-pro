import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Phone, MessageCircle, BellPlus,
  Plus, AlertCircle, Clock, Flame, Snowflake, ThermometerSun
} from 'lucide-react';
import { Lead, LeadTemp } from '../types';
import { useData } from '../contexts/DataContext';


// --- Components ---

const TempBadge: React.FC<{ temp: LeadTemp }> = ({ temp }) => {
  if (temp === 'Hot') {
    return (
      <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-800 shadow-sm w-fit">
        <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
        <span className="text-[10px] font-extrabold uppercase tracking-wider">Hot</span>
      </div>
    );
  }
  if (temp === 'Warm') {
    return (
      <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/30 px-2.5 py-1 rounded-full border border-orange-100 dark:border-orange-800 shadow-sm w-fit">
        <ThermometerSun className="w-3.5 h-3.5 text-orange-500" />
        <span className="text-[10px] font-extrabold uppercase tracking-wider">Warm</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600 shadow-sm w-fit">
      <Snowflake className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-[10px] font-extrabold uppercase tracking-wider">Cold</span>
    </div>
  );
};

const FilterChips: React.FC<{ active: string, onChange: (id: string) => void }> = ({ active, onChange }) => {
  const filters = [
    { id: 'all', label: 'All Leads' },
    { id: 'new', label: 'New' },
    { id: 'hot', label: 'Hot Leads' },
    { id: 'action', label: 'Follow Up' },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => onChange(f.id)}
          className={`
            whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all
            ${active === f.id
              ? 'bg-slate-900 dark:bg-blue-600 text-white shadow-md transform scale-105'
              : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white'}
          `}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
};

const StatusSelect: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    'New': 'text-blue-700 bg-blue-50 border-blue-100',
    'Contacted': 'text-amber-700 bg-amber-50 border-amber-100',
    'Qualified': 'text-emerald-700 bg-emerald-50 border-emerald-100',
    'Lost': 'text-slate-500 bg-slate-100 border-slate-200',
    'Waiting': 'text-purple-700 bg-purple-50 border-purple-100'
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${colors[status] || colors['Lost']}`}>
      {status}
    </span>
  );
};

// --- Main Page Component ---

export const Leads: React.FC = () => {
  const navigate = useNavigate();
  const { leads, loading } = useData();

  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [tempFilter, setTempFilter] = useState<LeadTemp | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [view, setView] = useState<'list' | 'grid'>('list');

  // Filter Leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTemp = tempFilter === 'All' || lead.temperature === tempFilter;
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesTemp && matchesStatus;
  });

  // Helpers
  const getTempIcon = (temp: LeadTemp) => {
    switch (temp) {
      case 'Hot': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'Warm': return <ThermometerSun className="w-4 h-4 text-amber-500" />;
      case 'Cold': return <Snowflake className="w-4 h-4 text-blue-400" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'Contacted': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'Qualified': return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
      case 'Lost': return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
      default: return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
    }
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

      {/* Header */}
      <div className="px-4 py-4 md:px-6 md:py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 transition-colors">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Leads</h1>
            <button
              onClick={() => navigate('/leads/new')}
              className="flex items-center gap-2 bg-slate-900 dark:bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Lead</span>
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700/50 border-none rounded-xl text-sm focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none text-slate-700 dark:text-slate-200 cursor-pointer transition-colors whitespace-nowrap"
              >
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
              <select
                value={tempFilter}
                onChange={(e) => setTempFilter(e.target.value as any)}
                className="pl-3 pr-8 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-600 outline-none text-slate-700 dark:text-slate-200 cursor-pointer transition-colors whitespace-nowrap"
              >
                <option value="All">All Temps</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">

        {filteredLeads.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p>No leads found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg group-hover:bg-slate-200 dark:group-hover:bg-slate-600 transition-colors">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{lead.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {getTempIcon(lead.temperature)}
                          <span>{lead.temperature}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {lead.nextAction?.isOverdue && (
                    <div className="flex flex-col items-end">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/30 px-2 py-1 rounded-full animate-pulse">
                        <AlertCircle className="w-3 h-3" /> Overdue
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold block mb-1">Budget</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{lead.budget}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold block mb-1">Source</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{lead.source}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold block mb-1">Next Task</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm truncate block" title={lead.nextAction?.task || 'None'}>
                      {lead.nextAction?.task || 'None'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <span className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold block mb-1">Last Active</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{lead.lastActive}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex gap-2">
                    {lead.tags && lead.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); /* Call logic */ }}
                      className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-full transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); /* Email logic */ }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-full transition-colors"
                      title="Email"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate('/follow-up') }}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-full transition-colors"
                      title="Add Task"
                    >
                      <BellPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};