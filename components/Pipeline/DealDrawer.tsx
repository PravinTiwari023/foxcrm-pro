import React, { useState, useEffect } from 'react';
import {
  X, Clock, User, FileText, CreditCard, ArrowRight, ArrowLeft,
  CheckCircle, Trash2, Save, IndianRupee
} from 'lucide-react';
import { Deal, StageId, LeadSource } from '../../types';

interface DealDrawerProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onStageChange?: (dealId: string, newStage: StageId) => void;
  onDemote?: (dealId: string) => void; // Move back to leads
  onViewLead?: (dealId: string) => void;
}

export const DealDrawer: React.FC<DealDrawerProps> = ({ deal, isOpen, onClose, onStageChange, onDemote, onViewLead }) => {
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [docDetails, setDocDetails] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  // Keep track of the last valid deal for exit animation
  const [displayDeal, setDisplayDeal] = useState<Deal | null>(deal);

  useEffect(() => {
    if (deal) {
      setDisplayDeal(deal);
      setNegotiationPrice(deal.value || '');
      setDocDetails('');
      setPaymentAmount('');
    }
  }, [deal, isOpen]);

  // Don't render if we have no deal data at all
  if (!displayDeal) return null;

  const handleNextStage = (targetStage: StageId) => {
    if (onStageChange) onStageChange(displayDeal.id, targetStage);
  };

  const handlePrevStage = (targetStage: StageId) => {
    if (onStageChange) onStageChange(displayDeal.id, targetStage);
  };

  const handleBackToLeads = () => {
    // Logic to move back to leads (demote)
    if (onDemote) onDemote(displayDeal.id);
    onClose();
  };


  // --- Stage Specific Content ---

  const renderNegotiationContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Negotiation Details
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400 mb-4">
          Finalize the price and terms with the client before moving to documentation.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Finalized Price (INR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
            <input
              type="text"
              value={negotiationPrice}
              onChange={(e) => setNegotiationPrice(e.target.value)}
              className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleNextStage('documentation')}
          className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          Move to Next Stage <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleBackToLeads}
          className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-red-500 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 transition-colors flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Move Back to Leads
        </button>
      </div>
    </div>
  );

  const renderDocumentationContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl border border-amber-100 dark:border-amber-800">
        <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Documentation
        </h3>
        <p className="text-xs text-amber-600 dark:text-amber-400 mb-4">
          Track necessary documents and agreements.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Which Documentation?</label>
          <textarea
            value={docDetails}
            onChange={(e) => setDocDetails(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-24 resize-none"
            placeholder="E.g., Sale Agreement, ID Proofs, Property Title..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleNextStage('payment')}
          className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          Move to Next Stage <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handlePrevStage('negotiation')}
          className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Move Back to Negotiation
        </button>
      </div>
    </div>
  );

  const renderPaymentContent = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
        <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4" /> Payment Details
        </h3>
        <p className="text-xs text-purple-600 dark:text-purple-400 mb-4">
          Record the final payment details to close the deal.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Paid Amount (INR)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold"><IndianRupee className="w-4 h-4" /></span>
            <input
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleNextStage('closed')}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50"
        >
          <CheckCircle className="w-4 h-4" /> Close the Pipeline
        </button>
        <button
          onClick={() => handlePrevStage('documentation')}
          className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Move Back to Documentation
        </button>
      </div>
    </div>
  );

  const renderClosedContent = () => (
    <div className="flex flex-col items-center justify-center py-10 text-center animate-scale-up">
      <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/20">
        <CheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mb-2">Deal Closed!</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8">
        Great listing! This deal has been successfully processed and archieved.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold hover:scale-105 transition-transform"
      >
        Done
      </button>
    </div>
  );

  // Determine which content to render
  const renderContent = () => {
    switch (displayDeal.stage) {
      case 'negotiation': return renderNegotiationContent();
      case 'documentation': return renderDocumentationContent();
      case 'payment': return renderPaymentContent();
      case 'closed': return renderClosedContent();
      default: return <div className="p-4 text-center text-slate-400">Unknown Stage</div>;
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <div className="h-full flex flex-col">
          {/* Header (Lead Info) */}
          <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">{displayDeal.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-slate-500 dark:text-slate-400">{displayDeal.value}</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">{displayDeal.source}</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -mr-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={() => onViewLead?.(displayDeal.id)}
              className="w-full mt-4 py-2.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> View Lead Details
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-800">
            {/* Stage Progress Indicator */}
            <div className="relative flex items-center justify-between mb-8 px-2">
              {/* Progress Bar Line - positioned behind the circles */}
              <div className="absolute left-8 right-8 top-4 h-0.5 bg-slate-200 dark:bg-slate-700" />

              {['negotiation', 'documentation', 'payment'].map((s, idx) => {
                const stages = ['negotiation', 'documentation', 'payment', 'closed'];
                const currentIdx = stages.indexOf(displayDeal.stage);
                const stepIdx = stages.indexOf(s);
                const isCompleted = currentIdx > stepIdx || displayDeal.stage === 'closed';
                const isActive = displayDeal.stage === s;

                return (
                  <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 border-2
                                ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' :
                        isActive ? 'bg-blue-600 border-blue-600 text-white scale-110' :
                          'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-300'
                      }
                             `}>
                      {isCompleted ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`text-[10px] uppercase font-bold ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-300 dark:text-slate-600'}`}>
                      {s.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
};