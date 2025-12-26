import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Phone, MessageCircle, Video, Users, Check } from 'lucide-react';
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
    tags: ['Pre-approved', 'First-time Buyer'],
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
    tags: ['Cash Buyer', 'Urgent'],
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
    tags: ['Luxury', 'Waterfront'],
  },
];

export const AddFollowUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const lead = MOCK_LEADS.find(l => l.id === id);

  const [mode, setMode] = useState<'Call' | 'WhatsApp' | 'Online Meeting' | 'Physical Meeting'>('Call');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Set default date to tomorrow and time to 10am
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setTime('10:00');
  }, []);

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

  const handleSave = () => {
    if (!purpose || !date || !time) return;

    const task = {
      leadId: lead.id,
      mode,
      purpose,
      date,
      time,
    };

    console.log('New follow up scheduled:', task);
    navigate(`/leads/${id}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Follow Up</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set a reminder to connect with this lead.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Lead Info (Read-only) */}
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Attached Lead</label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
              {lead.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{lead.phone}</div>
            </div>
          </div>
        </div>

        {/* Mode Selection */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Interaction Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Call', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', ring: 'ring-blue-500' },
              { id: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', ring: 'ring-green-500' },
              { id: 'Online Meeting', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', ring: 'ring-purple-500' },
              { id: 'Physical Meeting', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', ring: 'ring-orange-500' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id as any)}
                className={`
                  p-3 rounded-xl border text-left transition-all flex items-center gap-3
                  ${mode === m.id
                    ? `${m.bg} border-transparent ring-2 ${m.ring}`
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'}
                `}
              >
                <m.icon className={`w-5 h-5 ${mode === m.id ? m.color : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${mode === m.id ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {m.id}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Purpose */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Purpose of Interaction</label>
          <textarea
            rows={4}
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Discuss property visit details, negotiate price..."
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
          />
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shrink-0">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!purpose || !date || !time}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4" />
            Schedule Follow Up
          </button>
        </div>
      </div>

    </div>
  );
};
