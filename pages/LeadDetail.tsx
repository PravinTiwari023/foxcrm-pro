import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, MessageCircle, Clock, ArrowRightCircle,
  Pencil, Plus, User, Mail, CheckCircle2
} from 'lucide-react';
import { Lead } from '../types';

// Mock data - in a real app, this would come from a store/API
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

const HistoryIcon: React.FC<{ type: string }> = ({ type }) => {
  const baseClasses = "w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-800 z-10 relative";
  switch (type) {
    case 'Call': return <div className={`${baseClasses} bg-blue-100 dark:bg-blue-900/50 text-blue-600`}><Phone className="w-4 h-4" /></div>;
    case 'Email': return <div className={`${baseClasses} bg-purple-100 dark:bg-purple-900/50 text-purple-600`}><Mail className="w-4 h-4" /></div>;
    case 'Meeting': return <div className={`${baseClasses} bg-orange-100 dark:bg-orange-900/50 text-orange-600`}><User className="w-4 h-4" /></div>;
    case 'WhatsApp': return <div className={`${baseClasses} bg-green-100 dark:bg-green-900/50 text-green-600`}><MessageCircle className="w-4 h-4" /></div>;
    case 'System': return <div className={`${baseClasses} bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400`}><CheckCircle2 className="w-4 h-4" /></div>;
    default: return <div className={`${baseClasses} bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400`}><Clock className="w-4 h-4" /></div>;
  }
};

const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex justify-between items-end mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">
    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">{title}</h3>
    {action}
  </div>
);

export const LeadDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the lead by ID
  const lead = MOCK_LEADS.find(l => l.id === id);

  if (!lead) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Lead not found</h2>
          <button
            onClick={() => navigate('/leads')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Leads
          </button>
        </div>
      </div>
    );
  }

  const handlePromote = () => {
    navigate(`/leads/${id}/promote`);
  };

  const handleEdit = () => {
    navigate(`/leads/${id}/edit`);
  };

  const handleAddFollowUp = () => {
    navigate(`/leads/${id}/follow-up`);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* Header & Primary Profile Info */}
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={() => navigate('/leads')}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-all shadow-sm"
          >
            <Pencil className="w-3 h-3" /> Edit Profile
          </button>
        </div>

        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-800 shadow-inner flex items-center justify-center text-slate-500 dark:text-slate-300 text-3xl font-bold overflow-hidden shrink-0">
            {lead.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{lead.name}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5 truncate">{lead.email}</p>
            <p className="text-slate-900 dark:text-slate-100 font-mono text-sm mt-1">{lead.phone}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wide border
                  ${lead.status === 'New' ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                  lead.status === 'Qualified' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                    'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                {lead.status}
              </span>
              {lead.tags.map(t => (
                <span key={t} className="px-2 py-0.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 shrink-0">
        <button
          onClick={handlePromote}
          className="col-span-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white py-3 px-4 rounded-xl shadow-md shadow-slate-200 dark:shadow-slate-900/50 flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]"
        >
          <ArrowRightCircle className="w-5 h-5" /> Promote to Pipeline
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 font-bold transition-all shadow-sm">
          <Phone className="w-4 h-4" /> Call
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-700 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-700 font-bold transition-all shadow-sm">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">

        {/* Upcoming Follow-ups Section */}
        <section>
          <SectionHeader
            title="Next Action"
            action={
              <button
                onClick={handleAddFollowUp}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Follow Up
              </button>
            }
          />

          {lead.nextAction ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${lead.nextAction.isOverdue ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${lead.nextAction.isOverdue ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{lead.nextAction.task}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${lead.nextAction.isOverdue ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                      {lead.nextAction.date}
                    </span>
                    {lead.nextAction.isOverdue && <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 tracking-wide">OVERDUE</span>}
                  </div>
                </div>
                <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors opacity-0 group-hover:opacity-100">
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-2 bg-slate-50/50 dark:bg-slate-800/50">
              <Clock className="w-8 h-8 opacity-20" />
              <span className="text-sm font-medium">No upcoming tasks</span>
            </div>
          )}
        </section>

        {/* Follow-up History Section */}
        <section>
          <SectionHeader title="Activity Timeline" />

          <div className="relative pl-4 space-y-0">
            {/* Continuous Line */}
            <div className="absolute top-2 bottom-6 left-[31px] w-0.5 bg-slate-200 dark:bg-slate-700" />

            {lead.history && lead.history.length > 0 ? (
              lead.history.map((item, idx) => (
                <div key={item.id} className="relative pl-12 pb-6 group">
                  {/* Icon centered on the line */}
                  <div className="absolute left-0 top-0">
                    <HistoryIcon type={item.type} />
                  </div>

                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm group-hover:shadow-md group-hover:border-blue-200 dark:group-hover:border-blue-700 transition-all">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.type}</p>
                      <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.summary}</p>
                    {item.user && (
                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                          {item.user.charAt(0)}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.user}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="pl-12 py-4 text-sm text-slate-400 italic">No history recorded yet.</div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
