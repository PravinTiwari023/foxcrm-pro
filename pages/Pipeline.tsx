import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, FileText, CreditCard, CheckCircle,
  Clock, AlertTriangle, Timer, MoreHorizontal
} from 'lucide-react';
import { Deal, StageId } from '../types';
import { useData } from '../contexts/DataContext';

// --- Configuration ---

const STAGES: { id: StageId; label: string; icon: React.ElementType; color: string; borderColor: string; bg: string }[] = [
  { id: 'negotiation', label: 'Negotiation', icon: MessageSquare, color: 'text-blue-600', borderColor: 'border-blue-500', bg: 'bg-blue-50' },
  { id: 'documentation', label: 'Documentation', icon: FileText, color: 'text-amber-600', borderColor: 'border-amber-500', bg: 'bg-amber-50' },
  { id: 'payment', label: 'Payment', icon: CreditCard, color: 'text-purple-600', borderColor: 'border-purple-500', bg: 'bg-purple-50' },
  { id: 'closed', label: 'Closed', icon: CheckCircle, color: 'text-emerald-600', borderColor: 'border-emerald-500', bg: 'bg-emerald-50' },
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
      <span className="absolute text-[8px] font-bold text-slate-700 dark:text-slate-300">{percentage}%</span>
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

// --- Main Pipeline Component ---

// --- Main Pipeline Component ---

export const Pipeline: React.FC = () => {
  const navigate = useNavigate();
  const { deals, loading } = useData();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${(val / 1000).toFixed(0)}k`;
  };

  const getDealsByStage = (stageId: StageId) => deals.filter(d => d.stage === stageId);
  const getStageTotal = (stageId: StageId) => getDealsByStage(stageId).reduce((acc, curr) => acc + curr.numericValue, 0);

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* Header */}
      <div className="px-4 py-4 md:px-6 md:py-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0 transition-colors">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Pipeline</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your active deals and move them to close.</p>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6 no-scrollbar">
        <div className="flex gap-4 h-full min-w-[1000px] md:min-w-0">

          {STAGES.map((stage) => {
            const stageDeals = getDealsByStage(stage.id);
            const stageColor = stage.color;

            return (
              <div key={stage.id} className="flex-1 flex flex-col min-w-[280px] bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
                {/* Stage Header */}
                <div className="p-4 border-b border-slate-200/50 dark:border-slate-700/50 flex justify-between items-center bg-white/50 dark:bg-slate-800/80 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stage.bg}`}>
                      <stage.icon className={`w-4 h-4 ${stageColor}`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">{stage.label}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {formatCurrency(getStageTotal(stage.id))} Vol.
                      </p>
                    </div>
                  </div>
                  <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {stageDeals.length}
                  </span>
                </div>

                {/* List Container */}
                <div className="flex-1 p-2 overflow-y-auto space-y-3 custom-scrollbar">
                  {stageDeals.map((deal) => (
                    <PipelineCard
                      key={deal.id}
                      deal={deal}
                      onClick={() => navigate(`/pipeline/${deal.id}`)}
                      stageColor={stageColor}
                    />
                  ))}

                  {/* Empty State for Column */}
                  {stageDeals.length === 0 && (
                    <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl gap-2">
                      <stage.icon className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                      <span className="text-xs text-slate-400 font-medium">No Deals</span>
                    </div>
                  )}

                  {/* Add Button Placeholder - Only on negotiation stage */}
                  {stage.id === 'negotiation' && (
                    <button
                      onClick={() => navigate('/pipeline/new')}
                      className="w-full py-3 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                    >
                      + Add New Deal
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};