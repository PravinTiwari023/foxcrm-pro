import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, TrendingUp, IndianRupee, Briefcase, Tag } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Deal } from '../types';

export const PromoteLead: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { leads, promoteToDeal, loading } = useData();

    const lead = leads.find(l => l.id === id);

    const [formData, setFormData] = useState({
        title: '',
        value: '',
        stage: 'negotiation' as any,
        source: 'Website' as any,
        numericValue: 0
    });

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (lead) {
            setFormData({
                title: lead.name,
                value: lead.budget,
                stage: 'negotiation',
                source: lead.source || 'Website',
                numericValue: parseInt(lead.budget.replace(/[^0-9]/g, '')) * (lead.budget.includes('Cr') ? 10000000 : 100000) || 0
            });
        }
    }, [lead]);

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

    const handlePromote = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const dealData = {
                title: formData.title,
                value: formData.value,
                numericValue: formData.numericValue,
                stage: formData.stage,
                source: formData.source,
                lastTouch: 'Just now',
                daysInStage: 0,
                completion: 10,
                tasks: [
                    { id: '1', label: 'Initial Meeting', done: true },
                    { id: '2', label: 'Requirement Analysis', done: false }
                ]
            };

            await promoteToDeal(id!, dealData);
            navigate('/pipeline');
        } catch (error) {
            console.error('Error promoting lead:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
            <form onSubmit={handlePromote} className="h-full flex flex-col">
                <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Promote to Deal</h2>
                    </div>
                    <button disabled={submitting} type="submit" className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                        {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <TrendingUp className="w-4 h-4" />}
                        Confirm Promotion
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Deal Information</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Deal Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Estimated Value</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.value}
                                            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Initial Stage</label>
                                    <select
                                        value={formData.stage}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value as any }))}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 dark:bg-slate-700 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]"
                                    >
                                        <option value="negotiation">Negotiation</option>
                                        <option value="documentation">Documentation</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                            Promoting this lead will create an active deal in your pipeline. The lead's status will be updated to "Qualified".
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
};
