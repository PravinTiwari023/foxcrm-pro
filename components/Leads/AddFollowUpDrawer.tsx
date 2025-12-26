import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, MessageCircle, Video, Users, Check } from 'lucide-react';
import { Lead } from '../../types';

interface AddFollowUpDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    initialLead?: Lead | null;
    onSave: (task: {
        leadId: string;
        mode: 'Call' | 'WhatsApp' | 'Online Meeting' | 'Physical Meeting';
        purpose: string;
        date: string;
        time: string;
    }) => void;
}

export const AddFollowUpDrawer: React.FC<AddFollowUpDrawerProps> = ({
    isOpen,
    onClose,
    initialLead,
    onSave,
}) => {
    const [lead, setLead] = useState<Lead | null>(initialLead || null);
    const [mode, setMode] = useState<'Call' | 'WhatsApp' | 'Online Meeting' | 'Physical Meeting'>('Call');
    const [purpose, setPurpose] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    // Update local lead state when initialLead changes
    useEffect(() => {
        setLead(initialLead || null);
    }, [initialLead]);

    // Set default date to tomorrow and time to 10am
    useEffect(() => {
        if (isOpen) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            setDate(tomorrow.toISOString().split('T')[0]);
            setTime('10:00');
        }
    }, [isOpen]);

    const handleSave = () => {
        if (!lead || !purpose || !date || !time) return;

        onSave({
            leadId: lead.id,
            mode,
            purpose,
            date,
            time,
        });
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-900 shadow-2xl z-[70] transform transition-transform duration-500 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Follow Up</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Set a reminder to connect with this lead.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Lead Info (Read-only for now as it's attached) */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Attached Lead</label>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                                {lead?.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">{lead?.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">{lead?.phone}</div>
                            </div>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div>
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
                                    onClick={() => setMode(m.id as any)}
                                    className={`
                    p-3 rounded-xl border text-left transition-all flex items-center gap-3
                    ${mode === m.id
                                            ? `${m.bg} border-transparent ring-2 ${m.ring}`
                                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}
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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
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
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Purpose of Interaction</label>
                        <textarea
                            rows={4}
                            value={purpose}
                            onChange={(e) => setPurpose(e.target.value)}
                            placeholder="e.g., Discuss property visit details, negotiate price..."
                            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
                        />
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-1 py-3 px-4 rounded-xl text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            Schedule Follow Up
                        </button>
                    </div>
                </div>

            </div>
        </>
    );
};
