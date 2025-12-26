import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Phone, MessageCircle, BellPlus,
  Plus, AlertCircle, Clock, Flame, Snowflake, ThermometerSun
} from 'lucide-react';
import { Lead, LeadTemp } from '../types';

// --- Mock Data ---
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Alice Freeman',
    email: 'alice@example.com',
    phone: '(555) 123-4567',
    status: 'Qualified',
    source: 'Zillow',
    interest: 'Buying',
    budget: '₹3.73 Cr',
    lastActive: '2h ago',
    temperature: 'Hot',
    nextAction: { date: 'Today, 2:00 PM', task: 'Follow-up Call', isOverdue: false },
    tags: ['Pre-approved', 'First-time Buyer'],
    notes: 'Looking for a 3bd/2ba near downtown. Pre-approval letter ready.',
    history: [
      { id: 'h1', type: 'Call', date: '2 hours ago', summary: 'Discussed budget and preferred neighborhoods.', user: 'You' },
      { id: 'h2', type: 'System', date: 'Yesterday', summary: 'Lead imported from Zillow.' },
    ]
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    phone: '(555) 987-6543',
    status: 'Contacted',
    source: 'Website',
    interest: 'Selling',
    budget: '₹5.4 Cr',
    lastActive: '5h ago',
    temperature: 'Warm',
    tags: ['Relocation', 'Seller'],
    notes: 'Needs to sell current home before buying. Timeline 3 months.',
    history: [
      { id: 'h1', type: 'Email', date: '5 hours ago', summary: 'Sent market analysis report.', user: 'You' },
    ]
  },
  {
    id: '3',
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    phone: '(555) 456-7890',
    status: 'Qualified',
    source: 'Referral',
    interest: 'Buying',
    budget: '₹6.64 Cr',
    lastActive: '1d ago',
    temperature: 'Hot',
    nextAction: { date: 'Yesterday', task: 'Send Contract', isOverdue: true },
    tags: ['Cash Buyer', 'Urgent'],
    notes: 'Cash buyer, very motivated. Wants to close fast.',
    history: [
      { id: 'h1', type: 'Meeting', date: 'Yesterday', summary: 'Showed property at 789 Downtown Pkwy.', user: 'You' },
      { id: 'h2', type: 'Call', date: '2 days ago', summary: 'Initial qualification call.', user: 'You' },
    ]
  },
  {
    id: '4',
    name: 'Diana Prince',
    email: 'diana@example.com',
    phone: '(555) 222-3333',
    status: 'Lost',
    source: 'Facebook',
    interest: 'Renting',
    budget: '₹2.07 L/mo',
    lastActive: '3d ago',
    temperature: 'Cold',
    tags: [],
    notes: 'Just looking, budget too low for current market.',
    history: [
      { id: 'h1', type: 'Note', date: '3 days ago', summary: 'Marked as cold. Budget unrealistic.', user: 'You' },
    ]
  },
  {
    id: '5',
    name: 'Evan Wright',
    email: 'evan@example.com',
    phone: '(555) 444-5555',
    status: 'New',
    source: 'Direct',
    interest: 'Buying',
    budget: '₹9.96 Cr',
    lastActive: '10m ago',
    temperature: 'Warm',
    nextAction: { date: 'Tomorrow', task: 'Schedule Showing', isOverdue: false },
    tags: ['Luxury', 'Waterfront'],
    notes: 'Interested in waterfront properties.',
    history: []
  },
];


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
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter Logic
  const filteredLeads = MOCK_LEADS.filter(lead => {
    if (activeFilter === 'new') return lead.status === 'New';
    if (activeFilter === 'hot') return lead.temperature === 'Hot';
    if (activeFilter === 'action') return lead.nextAction && (lead.nextAction.isOverdue || lead.status === 'New');
    return true;
  });

  const handleRowClick = (lead: Lead) => {
    navigate(`/leads/${lead.id}`);
  };

  const handleFollowUpClick = (lead: Lead) => {
    navigate(`/leads/${lead.id}/follow-up`);
  };

  const handleAddLead = () => {
    navigate('/leads/new');
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* --- Header --- */}
      <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Lead Qualification</h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Qualify, nurture, and convert incoming leads.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddLead}
            className="bg-slate-900 dark:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 dark:hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex flex-col md:flex-row gap-3 justify-between md:items-center">
          <FilterChips active={activeFilter} onChange={setActiveFilter} />
          <div className="relative md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm bg-white dark:bg-slate-700 dark:text-slate-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-8">

        {/* --- DESKTOP TABLE VIEW --- */}
        <div className="hidden md:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden transition-colors">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-600">
              <tr>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Lead Profile</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Temperature</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider">Next Follow-up</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="group hover:bg-blue-50/30 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    handleRowClick(lead);
                  }}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center font-bold text-sm ring-4 ring-slate-50 dark:ring-slate-800 group-hover:ring-blue-50 dark:group-hover:ring-blue-900/30 transition-all">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">{lead.name}</div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          <span className="truncate max-w-[120px]">{lead.phone}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <TempBadge temp={lead.temperature} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusSelect status={lead.status} />
                  </td>
                  <td className="px-6 py-4">
                    {lead.nextAction ? (
                      <div>
                        <div className={`flex items-center gap-1.5 ${lead.nextAction.isOverdue ? 'text-red-600 dark:text-red-400 font-bold' : 'text-slate-700 dark:text-slate-300 font-bold'}`}>
                          {lead.nextAction.isOverdue ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />}
                          <span>{lead.nextAction.date}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 ml-5.5 font-medium">{lead.nextAction.task}</div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic font-medium ml-6">No tasks</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Call">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg transition-colors" title="WhatsApp">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFollowUpClick(lead); }}
                        className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-lg transition-colors"
                        title="Add Follow Up"
                      >
                        <BellPlus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- MOBILE CARD VIEW --- */}
        <div className="md:hidden space-y-3">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden active:scale-[0.99] transition-transform"
              onClick={() => handleRowClick(lead)}
            >
              <div className="p-4">
                {/* Top Row: Avatar, Name, Temperature */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{lead.budget} • {lead.source}</p>
                    </div>
                  </div>
                  <TempBadge temp={lead.temperature} />
                </div>

                {/* Status and Next Action Row */}
                <div className="flex items-center justify-between">
                  <StatusSelect status={lead.status} />
                  {lead.nextAction ? (
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${lead.nextAction.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      <Clock className="w-3.5 h-3.5" />
                      <span>{lead.nextAction.date}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">No tasks</span>
                  )}
                </div>
              </div>

              {/* Compact Action Bar */}
              <div className="flex items-center justify-around border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-semibold">Call</span>
                </button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600"></div>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-500 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors"
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-semibold">WhatsApp</span>
                </button>
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-600"></div>
                <button
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition-colors"
                  onClick={(e) => { e.stopPropagation(); handleFollowUpClick(lead); }}
                >
                  <BellPlus className="w-4 h-4" />
                  <span className="text-xs font-semibold">Follow Up</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};