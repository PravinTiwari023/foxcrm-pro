import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Phone, MessageCircle, Video, Users, Check } from 'lucide-react';
import { Lead, LeadTemp } from '../types';
import { useData } from '../contexts/DataContext';

export const AddFollowUp: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { leads, addFollowUp, loading } = useData();

  const lead = leads.find(l => l.id === id);

  const [mode, setMode] = useState<'Call' | 'WhatsApp' | 'Online Meeting' | 'Physical Meeting'>('Call');
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
    setTime('10:00');
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Lead not found</h2>
          <button onClick={() => navigate('/leads')} className="text-blue-600 hover:text-blue-700 font-medium">Back to Leads</button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!purpose || !date || !time) return;
    setSubmitting(true);

    try {
      const dueDate = new Date(`${date}T${time}`);

      const taskTypeMap: Record<string, 'Call' | 'Meeting' | 'Email' | 'Task'> = {
        'Call': 'Call',
        'WhatsApp': 'Task',
        'Online Meeting': 'Meeting',
        'Physical Meeting': 'Meeting'
      };

      await addFollowUp({
        leadId: lead.id,
        leadName: lead.name,
        leadTemp: lead.temperature,
        leadPhone: lead.phone,
        taskType: taskTypeMap[mode] || 'Task',
        description: purpose,
        dueDate: dueDate,
        displayTime: time,
        isOverdue: false,
        status: 'pending'
      } as any);

      navigate(`/leads/${id}`);
    } catch (error) {
      console.error('Error scheduling follow up:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Follow Up</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Set a reminder to connect with this lead.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Attached Lead</label>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{lead.name.charAt(0)}</div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{lead.name}</div>
              <div className="text-xs text-slate-500">{lead.phone}</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'Call', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50', ring: 'ring-blue-500' },
              { id: 'WhatsApp', icon: MessageCircle, color: 'text-green-600', bg: 'bg-green-50', ring: 'ring-green-500' },
              { id: 'Online Meeting', icon: Video, color: 'text-purple-600', bg: 'bg-purple-50', ring: 'ring-purple-500' },
              { id: 'Physical Meeting', icon: Users, color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-500' },
            ].map((m) => (
              <button key={m.id} type="button" onClick={() => setMode(m.id as any)} className={`p-3 rounded-xl border text-left flex items-center gap-3 ${mode === m.id ? `${m.bg} ring-2 ${m.ring} border-transparent` : 'bg-white dark:bg-slate-700 border-slate-200'}`}>
                <m.icon className={`w-5 h-5 ${mode === m.id ? m.color : 'text-slate-400'}`} />
                <span className={`text-sm font-semibold ${mode === m.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{m.id}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:bg-slate-700 text-sm font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:bg-slate-700 text-sm font-medium" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-4">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Purpose</label>
          <textarea rows={4} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g., Discuss property visit..." className="w-full p-4 rounded-xl border border-slate-200 dark:bg-slate-700 text-sm resize-none" />
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 shrink-0">
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-white dark:bg-slate-700 border border-slate-200">Cancel</button>
          <button onClick={handleSave} disabled={!purpose || !date || !time || submitting} className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            Schedule
          </button>
        </div>
      </div>
    </div>
  );
};
