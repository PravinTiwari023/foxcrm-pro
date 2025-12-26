import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Clock, User, FileText, CreditCard, ArrowRight, ArrowLeftIcon,
  CheckCircle, Trash2, IndianRupee
} from 'lucide-react';
import { Deal, StageId } from '../types';

// Mock data - in a real app, this would come from a store/API
const INITIAL_PIPELINE: Deal[] = [
  {
    id: '1', title: 'Sarah Jenkins', value: '₹3.73 Cr', numericValue: 37350000,
    stage: 'negotiation', source: 'Zillow', lastTouch: '2h ago',
    completion: 25, isUrgent: true, daysInStage: 2,
    tasks: [
      { id: 't1', label: 'Price Agreement', done: false },
      { id: 't2', label: 'Terms Sheet', done: false }
    ]
  },
  {
    id: '2', title: 'Mike Ross', value: '₹7.05 Cr', numericValue: 70550000,
    stage: 'documentation', source: 'Referral', lastTouch: '1d ago',
    completion: 60, isUrgent: false, daysInStage: 5,
    tasks: [
      { id: 't1', label: 'Contract Signed', done: true },
      { id: 't2', label: 'ID Verified', done: true },
      { id: 't3', label: 'Title Search', done: false }
    ]
  },
  {
    id: '3', title: 'Tech Corp HQ', value: '₹9.96 Cr', numericValue: 99600000,
    stage: 'payment', source: 'Web', lastTouch: '4h ago',
    completion: 90, isUrgent: false, daysInStage: 1,
    tasks: [
      { id: 't1', label: 'Deposit Received', done: true },
      { id: 't2', label: 'Escrow Confirmed', done: true },
      { id: 't3', label: 'Final Transfer', done: false }
    ]
  },
  {
    id: '4', title: 'The Davidsons', value: '₹5.4 Cr', numericValue: 53950000,
    stage: 'negotiation', source: 'Ads', lastTouch: '30m ago',
    completion: 10, isUrgent: true, daysInStage: 8,
    tasks: [
      { id: 't1', label: 'Initial Offer', done: true },
      { id: 't2', label: 'Counter Offer', done: false }
    ]
  },
  {
    id: '5', title: 'Downtown Inv.', value: '₹17.43 Cr', numericValue: 174300000,
    stage: 'closed', source: 'Referral', lastTouch: '1w ago',
    completion: 100, isUrgent: false, daysInStage: 12,
    tasks: [
      { id: 't1', label: 'Keys Handed Over', done: true }
    ]
  },
];

export const DealDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [docDetails, setDocDetails] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    const foundDeal = INITIAL_PIPELINE.find(d => d.id === id);
    if (foundDeal) {
      setDeal(foundDeal);
      setNegotiationPrice(foundDeal.value || '');
    }
  }, [id]);

  if (!deal) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Deal not found</h2>
          <button
            onClick={() => navigate('/pipeline')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Pipeline
          </button>
        </div>
      </div>
    );
  }

  const handleStageChange = (newStage: StageId) => {
    setDeal(prev => prev ? { ...prev, stage: newStage } : null);
  };

  const handleBackToLeads = () => {
    // In a real app, this would move the deal back to leads
    console.log('Moving deal back to leads:', deal.id);
    navigate('/pipeline');
  };

  const handleViewLead = () => {
    // Navigate to lead detail - using the deal id as lead id for demo
    navigate(`/leads/${deal.id}`);
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
              className="w-full pl-7 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleStageChange('documentation')}
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
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 h-24 resize-none"
            placeholder="E.g., Sale Agreement, ID Proofs, Property Title..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleStageChange('payment')}
          className="w-full py-3 bg-slate-900 dark:bg-amber-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          Move to Next Stage <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleStageChange('negotiation')}
          className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Move Back to Negotiation
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
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-8">
        <button
          onClick={() => handleStageChange('closed')}
          className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50"
        >
          <CheckCircle className="w-4 h-4" /> Close the Pipeline
        </button>
        <button
          onClick={() => handleStageChange('documentation')}
          className="w-full py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" /> Move Back to Documentation
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
        Great listing! This deal has been successfully processed and archived.
      </p>
      <button
        onClick={() => navigate('/pipeline')}
        className="px-6 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg font-bold hover:scale-105 transition-transform"
      >
        Done
      </button>
    </div>
  );

  // Determine which content to render
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
      {/* Header (Lead Info) */}
      <div className="p-6 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate('/pipeline')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
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

        <button
          onClick={handleViewLead}
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
            const currentIdx = stages.indexOf(deal.stage);
            const stepIdx = stages.indexOf(s);
            const isCompleted = currentIdx > stepIdx || deal.stage === 'closed';
            const isActive = deal.stage === s;

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
  );
};
