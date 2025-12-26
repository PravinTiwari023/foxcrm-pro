import React, { useState, useEffect } from 'react';
import {
  X, Phone, MessageCircle, Clock, ArrowRightCircle,
  Pencil, Plus, User, Mail, CheckCircle2
} from 'lucide-react';
import { Lead } from '../../types';

interface LeadDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onPromote?: () => void;
  onEdit?: (lead: Lead) => void;
  onAddFollowUp?: (lead: Lead) => void;
}

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

export const LeadDrawer: React.FC<LeadDrawerProps> = ({ lead, isOpen, onClose, onPromote, onEdit, onAddFollowUp }) => {
  // Keep track of the last valid lead for exit animation
  const [displayLead, setDisplayLead] = useState<Lead | null>(lead);

  useEffect(() => {
    if (lead) {
      setDisplayLead(lead);
    }
  }, [lead]);

  // Don't render if we have no lead data at all
  if (!displayLead) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">

          {/* 1. Header & Primary Profile Info */}
          <div className="bg-white dark:bg-slate-800 px-6 py-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div className="flex justify-between items-start mb-4">
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={() => onEdit?.(displayLead)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-300 transition-all shadow-sm"
              >
                <Pencil className="w-3 h-3" /> Edit Profile
              </button>
            </div>

            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-800 shadow-inner flex items-center justify-center text-slate-500 dark:text-slate-300 text-3xl font-bold overflow-hidden shrink-0">
                {displayLead.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{displayLead.name}</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-0.5 truncate">{displayLead.email}</p>
                <p className="text-slate-900 dark:text-slate-100 font-mono text-sm mt-1">{displayLead.phone}</p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase tracking-wide border
                      ${displayLead.status === 'New' ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800' :
                      displayLead.status === 'Qualified' ? 'bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800' :
                        'bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600'}`}>
                    {displayLead.status}
                  </span>
                  {displayLead.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-[10px] font-bold rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Top Action Bar */}
          <div className="bg-white dark:bg-slate-800 px-6 py-4 border-b border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 shrink-0">
            <button
              onClick={onPromote}
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

          {/* 3. Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-24">

            {/* Upcoming Follow-ups Section */}
            <section>
              <SectionHeader
                title="Next Action"
                action={
                  <button
                    onClick={() => onAddFollowUp?.(displayLead)}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Follow Up
                  </button>
                }
              />

              {displayLead.nextAction ? (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${displayLead.nextAction.isOverdue ? 'bg-red-500' : 'bg-blue-500'}`} />
                  <div className="flex items-start gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${displayLead.nextAction.isOverdue ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{displayLead.nextAction.task}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${displayLead.nextAction.isOverdue ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                          {displayLead.nextAction.date}
                        </span>
                        {displayLead.nextAction.isOverdue && <span className="text-[10px] font-extrabold text-red-600 dark:text-red-400 tracking-wide">OVERDUE</span>}
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

                {displayLead.history && displayLead.history.length > 0 ? (
                  displayLead.history.map((item, idx) => (
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
      </div>
    </>
  );
};