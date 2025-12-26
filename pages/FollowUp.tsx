import React, { useState, useEffect } from 'react';
import {
  CheckCircle, Clock, Phone, MessageCircle,
  Flame, Snowflake, ThermometerSun, AlertCircle, ChevronRight,
  MoreHorizontal, StickyNote, X, Timer
} from 'lucide-react';

import { FollowUpTask, LeadTemp } from '../types';

// --- Mock Data ---

const TODAY = new Date();
const YESTERDAY = new Date(new Date().setDate(TODAY.getDate() - 1));
const TOMORROW = new Date(new Date().setDate(TODAY.getDate() + 1));

const MOCK_TASKS: FollowUpTask[] = [
  {
    id: 't1', leadId: 'l1', leadName: 'Alice Freeman', leadTemp: 'Hot', leadPhone: '(555) 123-4567',
    taskType: 'Call', description: 'Discuss counter-offer details',
    dueDate: TODAY, displayTime: '10:00 AM', isOverdue: false, status: 'pending'
  },
  {
    id: 't2', leadId: 'l2', leadName: 'Bob Smith', leadTemp: 'Warm', leadPhone: '(555) 987-6543',
    taskType: 'Email', description: 'Send updated property list',
    dueDate: YESTERDAY, displayTime: 'Yesterday', isOverdue: true, status: 'pending'
  },
  {
    id: 't3', leadId: 'l3', leadName: 'Charlie Davis', leadTemp: 'Hot', leadPhone: '(555) 456-7890',
    taskType: 'Meeting', description: 'Coffee meeting at downtown office',
    dueDate: TODAY, displayTime: '2:30 PM', isOverdue: false, status: 'pending'
  },
  {
    id: 't4', leadId: 'l4', leadName: 'Diana Prince', leadTemp: 'Cold', leadPhone: '(555) 000-1111',
    taskType: 'Call', description: 'Check in (6 month follow up)',
    dueDate: TOMORROW, displayTime: 'Tomorrow, 11:00 AM', isOverdue: false, status: 'pending'
  },
  {
    id: 't5', leadId: 'l5', leadName: 'Evan Wright', leadTemp: 'Warm', leadPhone: '(555) 222-3333',
    taskType: 'Task', description: 'Prepare contract draft',
    dueDate: TODAY, displayTime: '4:00 PM', isOverdue: false, status: 'pending'
  }
];

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
    case 'Email': return <MessageCircle className={styles} />; // Using MessageCircle generically for comms
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

  // Minimum swipe distance
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
      // Limit offset visual
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
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swiped Left -> Reschedule
      onReschedule();
    } else if (isRightSwipe) {
      // Swiped Right -> Complete
      onComplete();
    }

    // Reset
    setOffset(0);
    setIsSwiping(false);
  };

  const bgColor = offset > 0 ? 'bg-emerald-500' : (offset < 0 ? 'bg-amber-500' : 'bg-white dark:bg-slate-800');
  const actionText = offset > 0 ? 'Complete' : 'Reschedule';
  const actionIcon = offset > 0 ? <CheckCircle className="text-white w-6 h-6" /> : <Clock className="text-white w-6 h-6" />;
  const opacity = Math.min(Math.abs(offset) / 100, 1);

  return (
    <div className="relative overflow-hidden rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-3 select-none">
      {/* Background Action Layer */}
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

      {/* Foreground Card Content */}
      <div
        className={`
          relative bg-white dark:bg-slate-800 p-4 transition-transform duration-200 ease-out
          ${isSelected ? 'ring-2 ring-blue-500 border-transparent' : ''}
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
          <button className="text-slate-400 hover:text-slate-600 md:hidden">
            <MoreHorizontal className="w-5 h-5" />
          </button>
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

          {/* Mobile Quick Actions (Visible if not swiping) */}
          <div className="flex gap-3 md:hidden">
            <button
              className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900"
              onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${task.leadPhone}`; }}
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
              className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-100 dark:hover:bg-green-900"
              onClick={(e) => { e.stopPropagation(); /* WA Link */ }}
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
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-100 dark:border-slate-700 transform transition-all duration-500 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          <div className="p-6">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-amber-50/50 dark:ring-amber-900/20">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center">Reschedule Task</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6 text-center">
              Pick a new time for this follow-up.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => onConfirm('Tomorrow')} className="py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors">
                Tomorrow
              </button>
              <button onClick={() => onConfirm('Next Week')} className="py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 transition-colors">
                Next Week
              </button>
            </div>

            <div className="relative mb-6">
              <input type="datetime-local" className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-medium bg-white dark:bg-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none" />
            </div>

            <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-blue-600 text-white font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-lg shadow-slate-200 dark:shadow-slate-900/50">
              Save New Time
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Main Page ---

export const FollowUp: React.FC = () => {
  const [tasks, setTasks] = useState<FollowUpTask[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue'>('today');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  // Auto-select first task on desktop load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && !selectedTaskId && tasks.length > 0) {
        setSelectedTaskId(tasks[0].id);
      }
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [tasks, selectedTaskId]);

  const filteredTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    if (activeTab === 'overdue') return t.isOverdue;
    if (activeTab === 'upcoming') return t.dueDate > TODAY && !t.isOverdue;
    return t.dueDate <= TODAY && !t.isOverdue; // Broadly "Today" bucket
  });

  const getCount = (tab: string) => {
    if (tab === 'overdue') return tasks.filter(t => t.isOverdue && t.status !== 'completed').length;
    if (tab === 'upcoming') return tasks.filter(t => t.dueDate > TODAY && !t.isOverdue && t.status !== 'completed').length;
    return tasks.filter(t => t.dueDate <= TODAY && !t.isOverdue && t.status !== 'completed').length;
  };

  const handleComplete = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed' } : t));
    // Simulation of Toast
    // alert("Task marked completed!"); 
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const handleReschedule = (id: string) => {
    setShowReschedule(true);
  };

  const activeTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden transition-colors">

      {/* --- Header --- */}
      <div className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center shrink-0 transition-colors">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Action Center</h1>
          <p className="hidden md:block text-xs text-slate-500 dark:text-slate-400 mt-0.5">Prioritized follow-ups and tasks.</p>
        </div>
        <div className="hidden md:block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Tabs */}
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
                <span className={`
                  px-2 py-0.5 rounded-full text-[10px] 
                  ${tab.isAlert ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Task List Column (Full width on mobile, 1/3 on desktop) */}
        <div className={`
          flex-1 md:w-1/3 md:flex-none md:border-r border-slate-200 dark:border-slate-700 overflow-y-auto p-4 custom-scrollbar
          ${selectedTaskId ? 'hidden md:block' : 'block'} 
        `}>
          <div className="space-y-1 pb-24 md:pb-8">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              {filteredTasks.length} Tasks Pending
            </p>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <SwipeableTaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTaskId === task.id}
                  onSelect={() => setSelectedTaskId(task.id)}
                  onComplete={() => handleComplete(task.id)}
                  onReschedule={() => handleReschedule(task.id)}
                />
              ))
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 gap-3">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-medium">All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Details Column (Desktop only usually, but handling visible state logic) */}
        <div className={`
          flex-1 bg-white dark:bg-slate-800 flex-col h-full overflow-y-auto
          ${selectedTaskId ? 'flex fixed inset-0 z-20 md:static md:z-auto' : 'hidden md:flex'}
        `}>
          {activeTask ? (
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Mobile Header for Detail View */}
              <div className="md:hidden p-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-white dark:bg-slate-800 z-10 shrink-0">
                <button onClick={() => setSelectedTaskId(null)} className="p-2 -ml-2 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-full">
                  <ChevronRight className="w-6 h-6 dark:text-slate-300 rotate-180" />
                </button>
                <span className="font-bold text-slate-900 dark:text-white">Task Details</span>
              </div>

              <div className="p-6 md:p-8 flex-1 overflow-y-auto pb-24">
                {/* Header Profile */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xl text-slate-500 dark:text-slate-300">
                      {activeTask.leadName.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{activeTask.leadName}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                          <Phone className="w-3 h-3" /> {activeTask.leadPhone}
                        </div>
                        <div className={`
                                  px-2 py-0.5 rounded text-[10px] font-bold uppercase border
                                  ${activeTask.leadTemp === 'Hot' ? 'bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800' : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600'}
                               `}>
                          {activeTask.leadTemp}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-700 transition-colors">
                      <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 hover:border-green-200 dark:hover:border-green-700 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Current Task Block */}
                <div className="bg-slate-50 dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 mb-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                      <TaskTypeIcon type={activeTask.taskType} />
                      Current Task
                    </h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${activeTask.isOverdue ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'}`}>
                      {activeTask.isOverdue ? 'OVERDUE' : 'SCHEDULED'}
                    </span>
                  </div>
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-100 mb-2">{activeTask.description}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Clock className="w-4 h-4" />
                    Due: <span className="font-bold">{activeTask.displayTime}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => handleComplete(activeTask.id)}
                      className="flex items-center justify-center gap-2 py-3 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-slate-200 dark:shadow-slate-900/50"
                    >
                      <CheckCircle className="w-4 h-4" /> Mark Complete
                    </button>
                    <button
                      onClick={() => handleReschedule(activeTask.id)}
                      className="flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 text-slate-700 dark:text-slate-100 rounded-xl font-bold hover:bg-amber-50 dark:hover:bg-amber-900/30 hover:text-amber-700 dark:hover:text-amber-400 hover:border-amber-200 dark:hover:border-amber-700 transition-all"
                    >
                      <Clock className="w-4 h-4" /> Reschedule
                    </button>
                  </div>
                </div>

                {/* Quick Note */}
                <div className="mb-8">
                  <div className="flex justify-between items-end mb-3">
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Quick Note</h3>
                    <span className="text-xs text-slate-400">Auto-saves</span>
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none"
                      placeholder="Jot down interaction details..."
                    />
                    <div className="absolute bottom-3 right-3 text-slate-300 dark:text-slate-500">
                      <StickyNote className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* History Stub */}
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm uppercase tracking-wider mb-4">Recent Activity</h3>
                  <div className="space-y-4 pl-3 border-l-2 border-slate-100 dark:border-slate-700">
                    <div className="pl-4 relative">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Yesterday</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Sent email regarding pricing tiers.</p>
                    </div>
                    <div className="pl-4 relative">
                      <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">2 Days Ago</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Lead qualification call completed.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="w-16 h-16 bg-white dark:bg-slate-700 rounded-full shadow-sm flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="font-medium">Select a task to view details</p>
            </div>
          )}
        </div>
      </div>

      <RescheduleModal
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        onConfirm={() => {
          setShowReschedule(false);
          // Update logic would go here
        }}
      />
    </div>
  );
};