import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Clock, Phone, MessageCircle,
  Flame, Snowflake, ThermometerSun, AlertCircle, ChevronRight,
  MoreHorizontal, StickyNote, X, Timer
} from 'lucide-react';

import { FollowUpTask, LeadTemp } from '../types';
import { useData } from '../contexts/DataContext';

// --- Helpers ---

const TempIcon: React.FC<{ temp: LeadTemp }> = ({ temp }) => {
  if (temp === 'Hot') return <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500" />;
  if (temp === 'Warm') return <ThermometerSun className="w-3.5 h-3.5 text-orange-500" />;
  return <Snowflake className="w-3.5 h-3.5 text-slate-400" />;
};

const TaskTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  const styles = "w-4 h-4";
  switch (type) {
    case 'Call': return <Phone className={styles} />;
    case 'Email': return <MessageCircle className={styles} />;
    case 'Meeting': return <Clock className={styles} />;
    default: return <CheckCircle className={styles} />;
  }
};

// --- Components ---

const SwipeableTaskCard: React.FC<{
  task: FollowUpTask;
  onSelect: () => void;
  onComplete: () => void;
  onReschedule: () => void;
  isSelected: boolean;
}> = ({ task, onSelect, onComplete, onReschedule, isSelected }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart) {
      const currentOffset = e.targetTouches[0].clientX - touchStart;
      if (Math.abs(currentOffset) < 150) {
        setOffset(currentOffset);
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setOffset(0);
      setIsSwiping(false);
      return;
    }

    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) onReschedule();
    else if (distance < -minSwipeDistance) onComplete();

    setOffset(0);
    setIsSwiping(false);
  };

  const bgColor = offset > 0 ? 'bg-emerald-500' : (offset < 0 ? 'bg-amber-500' : 'bg-white dark:bg-slate-800');
  const actionText = offset > 0 ? 'Complete' : 'Reschedule';
  const actionIcon = offset > 0 ? <CheckCircle className="text-white w-6 h-6" /> : <Clock className="text-white w-6 h-6" />;

  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-3 select-none">
      <div
        className={`absolute inset-0 flex items-center justify-between px-6 ${bgColor} transition-colors duration-200`}
        style={{ opacity: isSwiping ? 1 : 0 }}
      >
        <div className={`flex items-center gap-2 ${offset > 0 ? 'opacity-100' : 'opacity-0'}`}>
          {actionIcon} <span className="text-white font-bold text-lg">{actionText}</span>
        </div>
        <div className={`flex items-center gap-2 ${offset < 0 ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white font-bold text-lg">{actionText}</span> {actionIcon}
        </div>
      </div>

      <div
        className={`
          relative bg-white dark:bg-slate-800 p-4 transition-transform duration-200 ease-out
          ${isSelected ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : ''}
        `}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onSelect}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`
                px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase flex items-center gap-1 border
                ${task.leadTemp === 'Hot' ? 'bg-red-50 text-red-600 border-red-100' :
                task.leadTemp === 'Warm' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                  'bg-slate-50 text-slate-500 border-slate-200'}
             `}>
              <TempIcon temp={task.leadTemp} /> {task.leadTemp}
            </div>
            {task.isOverdue && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                <AlertCircle className="w-3 h-3" /> Overdue
              </div>
            )}
          </div>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-0.5">{task.leadName}</h3>

        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm font-medium mb-3">
          <TaskTypeIcon type={task.taskType} />
          <span>{task.description}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-700">
          <div className={`flex items-center gap-1.5 text-xs font-bold ${task.isOverdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
            <Clock className="w-3.5 h-3.5" />
            {task.displayTime}
          </div>

          <div className="flex gap-3">
            <button
              className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${task.leadPhone}`; }}
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reschedule Modal ---

const RescheduleModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (dateStr: string) => void }> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-700 transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="p-6">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-amber-50/50 dark:ring-amber-900/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">Reschedule Task</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 text-center">Pick a new time for this follow-up.</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => onConfirm('Tomorrow')} className="py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Tomorrow</button>
              <button onClick={() => onConfirm('Next Week')} className="py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">Next Week</button>
            </div>

            <div className="relative mb-6">
              <input type="datetime-local" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium bg-white dark:bg-slate-700 dark:text-slate-100 outline-none" />
            </div>

            <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-lg shadow-slate-200 dark:shadow-slate-900/50">Save New Time</button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Page ---

export const FollowUp: React.FC = () => {
  const { tasks, completeTask, loading } = useData();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue'>('today');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  const now = new Date();
  const todayStart = new Date(now.setHours(0, 0, 0, 0));
  const todayEnd = new Date(now.setHours(23, 59, 59, 999));

  const filteredTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const date = t.dueDate?.toDate ? t.dueDate.toDate() : new Date(t.dueDate);

    if (activeTab === 'overdue') return t.isOverdue;
    if (activeTab === 'upcoming') return date > todayEnd && !t.isOverdue;
    return date >= todayStart && date <= todayEnd && !t.isOverdue;
  });

  const getCount = (tab: string) => {
    return tasks.filter(t => {
      if (t.status === 'completed') return false;
      const date = t.dueDate?.toDate ? t.dueDate.toDate() : new Date(t.dueDate);
      if (tab === 'overdue') return t.isOverdue;
      if (tab === 'upcoming') return date > todayEnd && !t.isOverdue;
      return date >= todayStart && date <= todayEnd && !t.isOverdue;
    }).length;
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-3 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">
      <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Action Center</h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prioritized follow-ups and tasks.</p>
        </div>
      </div>

      <div className="px-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'today', label: 'Today', count: getCount('today') },
            { id: 'upcoming', label: 'Upcoming', count: getCount('upcoming') },
            { id: 'overdue', label: 'Overdue', count: getCount('overdue'), isAlert: true }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 py-3 border-b-2 text-sm font-bold transition-all whitespace-nowrap
                ${activeTab === tab.id
                  ? (tab.isAlert ? 'border-red-500 text-red-600' : 'border-slate-900 dark:border-blue-400 text-slate-900 dark:text-white')
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}
              `}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab.isAlert ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className={`flex-1 md:w-1/3 md:flex-none md:border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-4 custom-scrollbar ${selectedTaskId ? 'hidden md:block' : 'block'}`}>
          <div className="space-y-1 pb-24 md:pb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">{filteredTasks.length} Tasks Pending</p>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <SwipeableTaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onSelect={() => setSelectedTaskId(task.id)}
                  onComplete={() => completeTask(task.id)}
                  onReschedule={() => setShowReschedule(true)}
                />
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                <CheckCircle className="w-12 h-12 opacity-20" />
                <p className="font-medium">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        <div className={`flex-1 bg-white dark:bg-slate-800 flex-col h-full overflow-y-auto ${selectedTaskId ? 'flex fixed inset-0 z-20 md:static md:z-auto' : 'hidden md:flex'}`}>
          {activeTask ? (
            <div className="flex flex-col h-full">
              <div className="md:hidden p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-800 shrink-0">
                <button onClick={() => setSelectedTaskId(null)} className="p-2 -ml-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full">
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <span className="font-bold text-slate-900 dark:text-white">Task Details</span>
              </div>

              <div className="p-6 md:p-8 flex-1 overflow-y-auto pb-24">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xl text-slate-500">
                      {activeTask.leadName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeTask.leadName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                          <Phone className="w-3 h-3" /> {activeTask.leadPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <TaskTypeIcon type={activeTask.taskType} />
                      Current Task
                    </h3>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">{activeTask.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    Due: <span className="font-bold">{activeTask.displayTime}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => { completeTask(activeTask.id); setSelectedTaskId(null); }}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold shadow-lg"
                    >
                      <CheckCircle className="w-4 h-4" /> Complete
                    </button>
                    <button
                      onClick={() => setShowReschedule(true)}
                      className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 rounded-xl font-bold"
                    >
                      <Clock className="w-4 h-4" /> Reschedule
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-900/50">
              <Clock className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium">Select a task to view details</p>
            </div>
          )}
        </div>
      </div>

      <RescheduleModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        onConfirm={() => setShowReschedule(false)}
      />
    </div>
  );
};