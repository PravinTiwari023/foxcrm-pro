import React, { useState, useEffect } from 'react';
import {
    X, User, Phone, MapPin, IndianRupee, FileText,
    ChevronDown, Check, Flame, ThermometerSun, Snowflake
} from 'lucide-react';
import { Lead } from '../../types';

const STAGE_OPTIONS = ['New', 'Contacted', 'Qualified', 'Negotiating', 'Won', 'Lost'];
const TAG_OPTIONS = ['First-Time Buyer', 'Investor', 'Relocating', 'Downsizing', 'Luxury', 'Commercial'];
// Added Temperature Options
const TEMP_OPTIONS = [
    { id: 'Hot', label: 'Hot', icon: Flame, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/30', ring: 'ring-red-500' },
    { id: 'Warm', label: 'Warm', icon: ThermometerSun, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/30', ring: 'ring-orange-500' },
    { id: 'Cold', label: 'Cold', icon: Snowflake, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/30', ring: 'ring-blue-500' }
];


interface AddLeadDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (lead: any) => void;
    initialLead?: Lead | null; // Added initialLead prop
}

export const AddLeadDrawer: React.FC<AddLeadDrawerProps> = ({ isOpen, onClose, onSave, initialLead }) => {
    // Initial State
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        location: '',
        tags: [] as string[],
        stage: 'New',
        budget: '',
        notes: '',
        temperature: 'Cold' // Default temperature
    });

    // Populate form data when initialLead changes
    useEffect(() => {
        if (initialLead) {
            setFormData({
                fullName: initialLead.name,
                phone: initialLead.phone,
                location: '', // Add location to Lead type if needed, or leave blank
                tags: initialLead.tags || [],
                stage: initialLead.status,
                budget: initialLead.budget,
                notes: initialLead.notes || '',
                temperature: initialLead.temperature || 'Cold'
            });
        } else {
            // Reset to default only if not editing (or when drawer opens empty)
            setFormData({
                fullName: '',
                phone: '',
                location: '',
                tags: [],
                stage: 'New',
                budget: '',
                notes: '',
                temperature: 'Cold'
            });
        }
    }, [initialLead, isOpen]);


    const [showTagDropdown, setShowTagDropdown] = useState(false);
    const [showStageDropdown, setShowStageDropdown] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSave) {
            onSave(formData);
        }
        onClose();
    };

    const toggleTag = (tag: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                <form onSubmit={handleSubmit} className="h-full flex flex-col">

                    {/* Header */}
                    <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                                {initialLead ? 'Edit Lead' : 'Add New Lead'}
                            </h2>
                        </div>
                        <button
                            type="submit"
                            className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-800 dark:hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                            <Check className="w-4 h-4" /> {initialLead ? 'Update' : 'Save'}
                        </button>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">

                        {/* Profile Section */}
                        <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shrink-0">
                                    {formData.fullName ? formData.fullName.charAt(0).toUpperCase() : <User className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Full Name *"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                                        required
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Enter the lead's full name</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={formData.phone}
                                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Interested Location"
                                    value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>

                        {/* Temperature Section (New) */}
                        <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Lead Temperature</h3>
                            <div className="flex gap-3">
                                {TEMP_OPTIONS.map((temp) => (
                                    <button
                                        key={temp.id}
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, temperature: temp.id }))}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all
                                            ${formData.temperature === temp.id
                                                ? `${temp.bg} border-transparent ring-2 ${temp.ring}`
                                                : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
                                            }
                                        `}
                                    >
                                        <temp.icon className={`w-4 h-4 ${formData.temperature === temp.id ? temp.color : 'text-slate-400'}`} />
                                        <span className={`text-sm font-bold ${formData.temperature === temp.id ? 'text-slate-900 dark:text-white' : ''}`}>
                                            {temp.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Lead Details */}
                        <div className="bg-white dark:bg-slate-800 p-6 border-b border-slate-200 dark:border-slate-700 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Lead Details</h3>

                            {/* Stage Dropdown */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Stage</label>
                                <button
                                    type="button"
                                    onClick={() => { setShowStageDropdown(!showStageDropdown); setShowTagDropdown(false); }}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                >
                                    <span>{formData.stage}</span>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStageDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showStageDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 overflow-hidden">
                                        {STAGE_OPTIONS.map(stage => (
                                            <button
                                                key={stage}
                                                type="button"
                                                onClick={() => {
                                                    setFormData(prev => ({ ...prev, stage }));
                                                    setShowStageDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors ${formData.stage === stage ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                {stage}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Budget */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <IndianRupee className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Budget (e.g., ₹4 Cr - ₹6 Cr)"
                                    value={formData.budget}
                                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Tags */}
                            <div className="relative">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Tags</label>
                                <button
                                    type="button"
                                    onClick={() => { setShowTagDropdown(!showTagDropdown); setShowStageDropdown(false); }}
                                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[48px]"
                                >
                                    <div className="flex items-center gap-2 flex-wrap">
                                        {formData.tags.length > 0 ? (
                                            formData.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                                                    {tag}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-slate-400">Select Tags</span>
                                        )}
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${showTagDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showTagDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                                        {TAG_OPTIONS.map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => toggleTag(tag)}
                                                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-between ${formData.tags.includes(tag) ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-200'}`}
                                            >
                                                {tag}
                                                {formData.tags.includes(tag) && <Check className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="bg-white dark:bg-slate-800 p-6">
                            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Notes</h3>
                            <div className="relative">
                                <textarea
                                    placeholder="Add any notes about this lead..."
                                    value={formData.notes}
                                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                                />
                                <div className="absolute bottom-3 right-3 text-slate-300 dark:text-slate-500">
                                    <FileText className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Mobile Save Button */}
                    <div className="md:hidden p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0">
                        <button
                            type="submit"
                            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" /> {initialLead ? 'Update Lead' : 'Save Lead'}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
};
