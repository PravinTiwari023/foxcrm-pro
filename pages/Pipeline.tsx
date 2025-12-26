import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileText, CreditCard, CheckCircle,
  Clock, AlertTriangle, Timer, MoreHorizontal
} from 'lucide-react';
import { Deal, StageId } from '../types';

// --- Configuration ---

const STAGES: { id: StageId; label: string; icon: React.ElementType; color: string; borderColor: string; bg: string }[] = [
  { id: 'negotiation', label: 'Negotiation', icon: MessageSquare, color: 'text-blue-600', borderColor: 'border-blue-500', bg: 'bg-blue-50' },
  { id: 'documentation', label: 'Documentation', icon: FileText, color: 'text-amber-600', borderColor: 'border-amber-500', bg: 'bg-amber-50' },
  { id: 'payment', label: 'Payment', icon: CreditCard, color: 'text-purple-600', borderColor: 'border-purple-500', bg: 'bg-purple-50' },
  { id: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-emerald-600', borderColor: 'border-emerald-500', bg: 'bg-emerald-50' },
];

// --- Mock Data ---

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

// --- Components ---

const ProgressRing: React.FC<{ percentage: number; colorClass?: string }> = ({ percentage, colorClass = "text-blue-600" }) => {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-10 h-10">
        <circle
          className="text-slate-100 dark:text-slate-700"
          strokeWidth="3"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
        <circle
          className={`${colorClass} transition-all duration-500`}
          strokeWidth="3"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="20"
          cy="20"
        />
      </svg>
      <span className="absolute text-[9px] font-bold text-slate-700 dark:text-slate-300">{percentage}%</span>
    </div>
  );
};

const PipelineCard: React.FC<{ deal: Deal; onClick: () => void; stageColor: string }> = ({ deal, onClick, stageColor }) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all cursor-pointer active:scale-[0.98] group relative
      `}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">{deal.title}</h4>
            {deal.isUrgent && (
              <span className="bg-red-50 text-red-600 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-red-100">
                <AlertTriangle className="w-2.5 h-2.5" /> URGENT
              </span>
            )}
          </div>
          <p className="font-mono text-sm font-semibold text-slate-600 dark:text-slate-300">{deal.value}</p>
        </div>

        <ProgressRing percentage={deal.completion} colorClass={stageColor.replace('text-', 'text-')} />
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400" title="Time in current stage">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-medium">{deal.daysInStage}d</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>{deal.lastTouch}</span>
          </div>
        </div>
        <button className="text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const Pipeline: React.FC = () => {
  const navigate = useNavigate();
  const [deals, setDeals] = useState<Deal[]>(INITIAL_PIPELINE);
  const [activeStage, setActiveStage] = useState<StageId>('negotiation');

  const getDealsByStage = (stage: StageId) => deals.filter(d => d.stage === stage);
  const getStageTotal = (stage: StageId) => getDealsByStage(stage).reduce((acc, curr) => acc + curr.numericValue, 0);

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const handleDealClick = (deal: Deal) => {
    navigate(`/pipeline/${deal.id}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* --- Header --- */}
      <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Transaction Engine</h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Active deals and closings.</p>
        </div>
      </div>

      {/* --- Mobile: Instagram-style Stage Nav --- */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 overflow-x-auto no-scrollbar transition-colors">
        <div className="flex px-2">
          {STAGES.map((stage) => {
            const isActive = activeStage === stage.id;
            const Icon = stage.icon;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`
                  flex flex-col items-center justify-center gap-1 py-3 px-4 min-w-[90px] transition-colors border-b-2
                  ${isActive ? `border-slate-800 dark:border-blue-400 text-slate-800 dark:text-white` : 'border-transparent text-slate-400 dark:text-slate-500'}
                `}
              >
                <div className={`p-2 rounded-full ${isActive ? stage.bg : 'bg-slate-50'}`}>
                  <Icon className={`w-5 h-5 ${isActive ? stage.color : 'text-slate-400'}`} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wide">{stage.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* --- Mobile: Vertical List for Active Stage --- */}
      <div className="md:hidden flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
            {getDealsByStage(activeStage).length} Active Deals
          </span>
          <span className="text-xs font-mono text-slate-800 dark:text-slate-100 font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
            {formatCurrency(getStageTotal(activeStage))}
          </span>
        </div>
        <div className="space-y-3">
          {getDealsByStage(activeStage).map(deal => (
            <PipelineCard
              key={deal.id}
              deal={deal}
              onClick={() => handleDealClick(deal)}
              stageColor={STAGES.find(s => s.id === activeStage)!.color}
            />
          ))}
        </div>
      </div>

      {/* --- Desktop: Kanban Board --- */}
      <div className="hidden md:flex flex-1 overflow-x-auto p-6 gap-6 w-full h-full">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="min-w-[320px] flex-1 flex flex-col h-full">
              {/* Column Header */}
              <div className={`
                flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-4
              `}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stage.bg}`}>
                    <Icon className={`w-5 h-5 ${stage.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm">{stage.label}</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      {formatCurrency(getStageTotal(stage.id))} Vol.
                    </p>
                  </div>
                </div>
                <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-600">
                  {getDealsByStage(stage.id).length}
                </span>
              </div>

              {/* Column Body */}
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pb-20">
                {getDealsByStage(stage.id).map(deal => (
                  <PipelineCard
                    key={deal.id}
                    deal={deal}
                    onClick={() => handleDealClick(deal)}
                    stageColor={stage.color}
                  />
                ))}
                {getDealsByStage(stage.id).length === 0 && (
                  <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 gap-2">
                    <Icon className="w-6 h-6 opacity-30" />
                    <span className="text-xs font-medium">No active deals</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};