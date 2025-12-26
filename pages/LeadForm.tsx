import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, MapPin, IndianRupee, FileText,
  ChevronDown, Check, Flame, ThermometerSun, Snowflake, Mail
} from 'lucide-react';
import { Lead, LeadTemp } from '../types';
import { useData } from '../contexts/DataContext';

const STAGE_OPTIONS = ['New', 'Contacted', 'Qualified', 'Waiting', 'Lost'] as const;
const TAG_OPTIONS = ['First-Time Buyer', 'Investor', 'Relocating', 'Downsizing', 'Luxury', 'Commercial'];
const TEMP_OPTIONS = [
  { id: 'Hot', label: 'Hot', icon: Flame, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30', ring: 'ring-red-500' },
  { id: 'Warm', label: 'Warm', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/30', ring: 'ring-orange-500' },
  { id: 'Cold', label: 'Cold', icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30', ring: 'ring-blue-500' }
];

export const LeadForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { leads, addLead, updateLead, loading } = useData();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'New' as typeof STAGE_OPTIONS[number],
    budget: '',
    notes: '',
    temperature: 'Cold' as LeadTemp,
    tags: [] as string[],
    source: 'Website' as any,
    interest: 'Buying' as any
  });

  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id && leads.length > 0) {
      const lead = leads.find(l => l.id === id);
      if (lead) {
        setFormData({
          name: lead.name,
          email: lead.email || '',
          phone: lead.phone,
          status: lead.status as any,
          budget: lead.budget || '',
          notes: lead.notes || '',
          temperature: lead.temperature || 'Cold',
          tags: lead.tags || [],
          source: lead.source || 'Website',
          interest: lead.interest || 'Buying'
        });
      }
    }
  }, [id, leads]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEditing && id) {
        await updateLead(id, formData);
      } else {
        await addLead({
          ...formData,
          lastActive: 'Just now',
          history: [{ id: 'h1', type: 'System', date: 'Just now', summary: 'Lead created' }]
        } as any);
      }
      navigate('/leads');
    } catch (error) {
      console.error('Error saving lead:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  if (loading && isEditing) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      <form onSubmit={handleSubmit} className="h-full flex flex-col">
        <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"><ArrowLeft className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">{isEditing ? 'Edit Lead' : 'Add New Lead'}</h2>
          </div>
          <button disabled={submitting} type="submit" className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm flex items-center gap-2 hover:bg-slate-800 transition-colors">
            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
            {isEditing ? 'Update' : 'Save'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 no-scrollbar">
          <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder:text-slate-400"
                  required
                />
                <p className="text-xs text-slate-400 mt-1">Full name of the contact</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Phone className="w-4 h-4" /></div>
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail className="w-4 h-4" /></div>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lead Temperature</h3>
            <div className="flex gap-3">
              {TEMP_OPTIONS.map((temp) => (
                <button
                  key={temp.id}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, temperature: temp.id as LeadTemp }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${formData.temperature === temp.id ? `${temp.bg} border-transparent ring-2 ${temp.ring} text-slate-900 dark:text-white` : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400'}`}
                >
                  <temp.icon className={`w-4 h-4 ${formData.temperature === temp.id ? temp.color : 'text-slate-400'}`} />
                  <span className="text-sm font-bold">{temp.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Pipeline Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Current Stage</label>
                <button type="button" onClick={() => { setShowStageDropdown(!showStageDropdown); setShowTagDropdown(false); }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
                  <span>{formData.status}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStageDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showStageDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl z-20 overflow-hidden">
                    {STAGE_OPTIONS.map(stage => (
                      <button key={stage} type="button" onClick={() => { setFormData(prev => ({ ...prev, status: stage })); setShowStageDropdown(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 ${formData.status === stage ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}>{stage}</button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Budget</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><IndianRupee className="w-4 h-4" /></div>
                  <input type="text" placeholder="e.g. ₹4 Cr - ₹6 Cr" value={formData.budget} onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))} className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm" />
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2 ml-1">Tags</label>
              <button type="button" onClick={() => { setShowTagDropdown(!showTagDropdown); setShowStageDropdown(false); }} className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 min-h-[48px]">
                <div className="flex items-center gap-2 flex-wrap">
                  {formData.tags.length > 0 ? formData.tags.map(tag => <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-full">{tag}</span>) : <span className="text-slate-400 text-sm">Select Tags</span>}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${showTagDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showTagDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-xl z-20 overflow-hidden max-h-48 overflow-y-auto">
                  {TAG_OPTIONS.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center justify-between ${formData.tags.includes(tag) ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-200'}`}>
                      {tag}
                      {formData.tags.includes(tag) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 pb-32">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Notes</h3>
            <textarea placeholder="Specific requirements, timeline, or notes..." value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm resize-none" />
          </div>
        </div>

        <div className="md:hidden p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <button disabled={submitting} type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">
            {submitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Check className="w-5 h-5" />}
            {isEditing ? 'Update Lead' : 'Save Lead'}
          </button>
        </div>
      </form>
    </div>
  );
};
