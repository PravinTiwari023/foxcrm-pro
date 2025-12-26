import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, User, FileText, CreditCard, ArrowRight, ArrowLeftIcon,
  CheckCircle, Trash2, IndianRupee
} from 'lucide-react';
import { Deal, StageId } from '../types';
import { useData } from '../contexts/DataContext';

export const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { deals, updateDeal, loading } = useData();

  const deal = deals.find(d => d.id === id);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [docDetails, setDocDetails] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    if (deal) {
      setNegotiationPrice(deal.value || '');
    }
  }, [deal]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Deal not found</h2>
          <button onClick={() => navigate('/pipeline')} className="text-blue-600 hover:text-blue-700 font-medium">Back to Pipeline</button>
        </div>
      </div>
    );
  }

  const handleStageChange = async (newStage: StageId) => {
    if (id) {
      await updateDeal(id, { stage: newStage });
    }
  };

  const renderNegotiationContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Negotiation Details
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">Finalize the price and terms with the client before moving to documentation.</p>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Finalized Price (INR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="text"
              value={negotiationPrice}
              onChange={(e) => setNegotiationPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-8">
        <button onClick={() => handleStageChange('documentation')} className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">Next Stage <ArrowRight className="w-4 h-4" /></button>
        <button onClick={() => navigate('/pipeline')} className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2"><Trash2 className="w-4 h-4" /> Move Back to Leads</button>
      </div>
    </div>
  );

  const renderDocumentationContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2"><FileText className="w-4 h-4" /> Documentation</h3>
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">Track necessary documents and agreements.</p>
        <textarea
          value={docDetails}
          onChange={(e) => setDocDetails(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white h-24 resize-none"
          placeholder="E.g., Sale Agreement, ID Proofs..."
        />
      </div>
      <div className="flex flex-col gap-3 mt-8">
        <button onClick={() => handleStageChange('payment')} className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2">Next Stage <ArrowRight className="w-4 h-4" /></button>
        <button onClick={() => handleStageChange('negotiation')} className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Negotiation</button>
      </div>
    </div>
  );

  const renderPaymentContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
        <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2"><CreditCard className="w-4 h-4" /> Payment Details</h3>
        <p className="text-xs text-purple-600 dark:text-purple-400 mb-4">Record the final payment details to close the deal.</p>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold"><IndianRupee className="w-4 h-4" /></span>
          <input
            type="number"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white"
            placeholder="0.00"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 mt-8">
        <button onClick={() => handleStageChange('closed')} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50 flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4" /> Close Deal</button>
        <button onClick={() => handleStageChange('documentation')} className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2"><ArrowLeftIcon className="w-4 h-4" /> Back to Docs</button>
      </div>
    </div>
  );

  const renderClosedContent = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-scale-up">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Deal Closed!</h2>
      <button onClick={() => navigate('/pipeline')} className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold">Done</button>
    </div>
  );

  const renderContent = () => {
    switch (deal.stage) {
      case 'negotiation': return renderNegotiationContent();
      case 'documentation': return renderDocumentationContent();
      case 'payment': return renderPaymentContent();
      case 'closed': return renderClosedContent();
      default: return <div className="p-4 text-center text-slate-400">Unknown Stage</div>;
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-white dark:bg-slate-800 overflow-hidden transition-colors">
      <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <button onClick={() => navigate('/pipeline')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">{deal.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{deal.value}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-sm text-slate-500 dark:text-slate-400">{deal.source}</span>
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => navigate(`/leads/${deal.leadId}`)} className="w-full mt-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><User className="w-4 h-4" /> View Lead Details</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800 no-scrollbar">
        <div className="relative flex items-center justify-between mb-8 px-2">
          <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 dark:bg-slate-700" />
          {['negotiation', 'documentation', 'payment'].map((s, idx) => {
            const stages = ['negotiation', 'documentation', 'payment', 'closed'];
            const currentIdx = stages.indexOf(deal.stage);
            const stepIdx = stages.indexOf(s);
            const isCompleted = currentIdx > stepIdx || deal.stage === 'closed';
            const isActive = deal.stage === s;

            return (
              <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 border-2
                  ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : isActive ? 'bg-blue-600 border-blue-600 text-white scale-110' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-300'}
                `}>{isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}</div>
                <span className={`text-[10px] uppercase font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>{s.slice(0, 3)}</span>
              </div>
            );
          })}
        </div>
        {renderContent()}
      </div>
    </div>
  );
};
