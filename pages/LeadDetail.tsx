import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, MessageCircle, Clock, ArrowRightCircle,
  Pencil, Plus, User, Mail, CheckCircle2
} from 'lucide-react';
import { Lead } from '../types';
import { useData } from '../contexts/DataContext';

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
  const { leads, loading } = useData();

  const lead = leads.find(l => l.id === id);

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

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex justify-between items-start mb-4">
          <button onClick={() => navigate('/leads')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <button onClick={() => navigate(`/leads/${id}/edit`)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 shadow-sm">
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
                  ${lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                  lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {lead.status}
              </span>
              {lead.tags && lead.tags.map(t => (
                <span key={t} className="px-2 py-0.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold rounded-full">#{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 shrink-0">
        <button onClick={() => navigate(`/leads/${id}/promote`)} className="col-span-2 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 font-bold transition-all">
          <ArrowRightCircle className="w-5 h-5" /> Promote to Pipeline
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-sm">
          <Phone className="w-4 h-4" /> Call
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-sm">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24 no-scrollbar">
        <section>
          <SectionHeader title="Next Action" action={<button onClick={() => navigate(`/leads/${id}/follow-up`)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-3 py-1.5 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add Follow Up</button>} />
          {lead.nextAction ? (
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${lead.nextAction.isOverdue ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl shrink-0 ${lead.nextAction.isOverdue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Clock className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{lead.nextAction.task}</p>
                  <p className="text-xs font-semibold text-slate-400 mt-1">{lead.nextAction.date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50/50 dark:bg-slate-800/50">
              <Clock className="w-8 h-8 opacity-20" />
              <span className="text-sm font-medium">No upcoming tasks</span>
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Activity Timeline" />
          <div className="relative pl-4">
            <div className="absolute top-2 bottom-6 left-[31px] w-0.5 bg-slate-200 dark:bg-slate-700" />
            {lead.history && lead.history.length > 0 ? (
              lead.history.map((item) => (
                <div key={item.id} className="relative pl-12 pb-6 group">
                  <div className="absolute left-0 top-0"><HistoryIcon type={item.type} /></div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.type}</p>
                      <span className="text-[11px] font-semibold text-slate-400">{item.date}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="pl-12 py-4 text-sm text-slate-400 italic font-mono">No history recorded yet.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
