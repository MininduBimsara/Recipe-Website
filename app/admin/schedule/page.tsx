'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, Clock, Sparkles, RefreshCw, Play, CheckCircle2, 
  FileText, ArrowLeft, AlertCircle, Settings, ChevronLeft, ChevronRight, CheckCircle,
  LayoutList
} from 'lucide-react';
import { getScheduleBacklogAction, runAutoPublishSimulationAction, updateReleaseScheduleAction } from '@/lib/actions/schedule';
import { toast } from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isBefore } from 'date-fns';

export default function AdminSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [backlog, setBacklog] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 5, 1)); // June 2026
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'drafts' | 'scheduled' | 'live'>('scheduled');

  // Drafts scheduling state
  const [draftDates, setDraftDates] = useState<Record<string, string>>({});

  const fetchBacklog = async () => {
    setLoading(true);
    try {
      const res = await getScheduleBacklogAction();
      if (res.success) {
        setBacklog(res.queue || []);
      } else {
        toast.error(res.error || 'Could not query release logs.');
      }
    } catch (err) {
      toast.error('Connection error querying backlog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBacklog();
  }, []);

  const handleSimulateAutoPublish = async () => {
    setSimulating(true);
    toast.loading('Spinning database clock gears to execute auto-publish loops...', { id: 'sim-cron' });
    try {
      const res = await runAutoPublishSimulationAction();
      if (res.success) {
        toast.success(res.message || 'Auto-publish routine finished successfully!', { id: 'sim-cron' });
        fetchBacklog();
      } else {
        toast.error(res.error || 'Auto-publish routine crashed.', { id: 'sim-cron' });
      }
    } catch (err) {
      toast.error('Simulation run failed.', { id: 'sim-cron' });
    } finally {
      setSimulating(false);
    }
  };

  const handleUpdateStatus = async (item: any, newStatus: 'draft' | 'scheduled' | 'published', scheduledUtc?: string) => {
    if (newStatus === 'draft') {
      const ok = window.confirm(`Revert "${item.title}" back to draft state?`);
      if (!ok) return;
    }

    try {
      const res = await updateReleaseScheduleAction(item.type, item.id, { 
        status: newStatus,
        scheduled_at_utc: scheduledUtc || null
      });
      if (res.success) {
        toast.success(`Successfully updated "${item.title}".`);
        fetchBacklog();
      } else {
        toast.error(res.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Update operation crashed.');
    }
  };

  const handleScheduleDraft = (item: any) => {
    const localVal = draftDates[item.id];
    if (!localVal) {
      toast.error("Please select a date and time to schedule.");
      return;
    }
    const utcVal = new Date(localVal).toISOString();
    handleUpdateStatus(item, 'scheduled', utcVal);
  };

  // Monthly calendar dates computation
  const monthStart = startOfMonth(currentMonthDate);
  const monthEnd = endOfMonth(currentMonthDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayItems = (day: Date) => {
    return backlog.filter(item => {
      if (item.status !== 'scheduled' || !item.scheduled_for) return false;
      const tDate = parseISO(item.scheduled_for);
      return isSameDay(tDate, day);
    });
  };

  const nextMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const scheduledItems = backlog.filter(item => item.status === 'scheduled');
  const publishedItems = backlog.filter(item => item.status === 'published' || item.is_published);
  const draftItems = backlog.filter(item => item.status === 'draft');

  return (
    <div className="w-full min-h-screen bg-[#FAFAF8] text-espresso py-10 px-6 select-none animate-fade-slide-up" id="admin-schedule-agenda-view">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-cream-dark/60 pb-4">
          <Link
            href="/admin"
            className="group inline-flex items-center gap-2 text-xs font-mono font-extrabold uppercase text-stone-606 hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Executive HQ Admin Dashboard</span>
          </Link>

          <span className="font-mono text-[10px] text-stone-500 font-extrabold tracking-widest uppercase">
            Publisher & Scheduler
          </span>
        </div>

        {/* Header Masthead */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-cream-dark shadow-2xs">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-terracotta">
              <CalendarIcon className="w-5 h-5" />
              <h1 className="font-serif font-black text-2xl sm:text-3xl leading-none">
                Publisher & Scheduler Hub
              </h1>
            </div>
            <p className="text-xs text-stone-550 max-w-xl font-sans leading-relaxed">
              Program publication workflows across global time zones. Schedule your drafts, unpublish live content, and manage your editorial calendar in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={fetchBacklog}
              disabled={loading}
              className="p-2.5 bg-white border border-cream-dark hover:border-text-espresso rounded-xl text-stone-605 transition-colors cursor-pointer"
              title="Refresh queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleSimulateAutoPublish}
              disabled={simulating}
              className="px-4 py-2.5 bg-espresso hover:bg-sage text-cream hover:text-white rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-3xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Auto-Publish</span>
            </button>
          </div>
        </header>

        {/* Queue Stats Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-stone-500 uppercase tracking-widest">Total Monitored</h4>
            <span className="font-serif font-black text-xl text-espresso">{backlog.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest font-extrabold text-stone-500">Drafts shelf</h4>
            <span className="font-serif font-black text-xl text-stone-540">{draftItems.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-terracotta uppercase tracking-widest">Queued/Scheduled</h4>
            <span className="font-serif font-black text-xl text-terracotta">{scheduledItems.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-sage uppercase tracking-widest">Live/Published</h4>
            <span className="font-serif font-black text-xl text-sage">{publishedItems.length}</span>
          </div>
        </div>

        {/* Splitted Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar visual grid box (Left) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-cream-dark shadow-2xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
              <div className="text-left">
                <span className="text-[9px] font-mono tracking-widest text-[#E60023] font-bold uppercase">
                  visual release grid Map
                </span>
                <h3 className="font-serif font-black text-base text-espresso">
                  {format(currentMonthDate, 'MMMM yyyy')}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 bg-cream hover:bg-cream-dark text-espresso rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 bg-cream hover:bg-cream-dark text-espresso rounded-lg transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays indicator */}
            <div className="grid grid-cols-7 gap-2 text-center font-mono text-[9px] font-bold text-stone-500 uppercase tracking-widest">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days grid layout */}
            <div className="grid grid-cols-7 gap-2" id="calendar-days-grids-parent">
              {/* Padding offset for first day */}
              {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
                <div key={`pad-${idx}`} className="aspect-square bg-cream-light/10 border border-transparent rounded-lg" />
              ))}

              {calendarDays.map((day) => {
                const isToday = isSameDay(day, new Date());
                const dayItems = getDayItems(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={`aspect-square p-1 border rounded-lg flex flex-col justify-between text-left transition-all relative ${
                      isToday 
                        ? 'bg-sage/5 border-sage font-extrabold shadow-inner' 
                        : (dayItems.length > 0 ? 'bg-terracotta/5 border-terracotta/40' : 'bg-[#FCFAF7]/40 border-cream-dark')
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${
                      isToday ? 'text-sage font-black' : 'text-stone-500'
                    }`}>
                      {day.getDate()}
                    </span>

                    {dayItems.length > 0 && (
                      <div className="w-full flex flex-col gap-0.5">
                        {dayItems.slice(0, 3).map((it, idx) => (
                          <div key={idx} className="w-full truncate text-[7px] font-bold text-terracotta bg-terracotta/10 px-1 py-0.5 rounded leading-none">
                            {format(parseISO(it.scheduled_for), 'HH:mm')} {it.title.substring(0,6)}
                          </div>
                        ))}
                        {dayItems.length > 3 && (
                          <div className="text-[7px] text-stone-400 pl-1">+{dayItems.length - 3} more</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Quick tips about auto simulation */}
            <div className="p-4 bg-sage/5 rounded-xl border border-sage/20 text-left space-y-2 mt-4">
              <span className="font-mono text-[9px] text-sage font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Simulation Sandbox Guidance
              </span>
              <p className="text-[10px] text-stone-605 font-sans leading-relaxed">
                A background cron job checks every minute for scheduled items in the past and publishes them automatically. Click <span className="font-bold">Simulate Auto-Publish</span> to manually execute this.
              </p>
            </div>
          </div>

          {/* Action Tabs & Lists (Right) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-cream-dark shadow-2xs overflow-hidden flex flex-col">
              
              {/* Tabs Header */}
              <div className="flex border-b border-cream-dark bg-[#FCFAF7]">
                <button 
                  onClick={() => setActiveTab('drafts')}
                  className={`flex-1 p-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'drafts' ? 'border-stone-800 text-stone-800' : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-cream/50'
                  }`}
                >
                  Drafts ({draftItems.length})
                </button>
                <button 
                  onClick={() => setActiveTab('scheduled')}
                  className={`flex-1 p-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'scheduled' ? 'border-terracotta text-terracotta' : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-cream/50'
                  }`}
                >
                  Scheduled ({scheduledItems.length})
                </button>
                <button 
                  onClick={() => setActiveTab('live')}
                  className={`flex-1 p-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border-b-2 ${
                    activeTab === 'live' ? 'border-sage text-sage' : 'border-transparent text-stone-400 hover:text-stone-600 hover:bg-cream/50'
                  }`}
                >
                  Live ({publishedItems.length})
                </button>
              </div>

              {/* Lists Content */}
              <div className="p-5 max-h-[600px] overflow-y-auto space-y-4">
                
                {loading ? (
                  <div className="py-12 text-center text-stone-400 text-xs font-mono uppercase tracking-widest flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    scanning content lines...
                  </div>
                ) : activeTab === 'drafts' ? (
                  /* DRAFTS TAB */
                  draftItems.length === 0 ? (
                    <div className="py-8 text-center text-stone-400 text-xs font-sans">No drafts available.</div>
                  ) : (
                    <div className="space-y-3">
                      {draftItems.map(item => (
                        <div key={`${item.type}-${item.id}`} className="p-3 rounded-lg border border-cream-dark bg-white shadow-3xs space-y-3 text-left transition hover:border-stone-300">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[8px] font-mono uppercase bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-extrabold">
                                  {item.type}
                                </span>
                                <span className="text-[8px] font-mono uppercase text-stone-400">
                                  {item.category}
                                </span>
                              </div>
                              <h4 className="font-serif font-bold text-sm text-espresso line-clamp-2 leading-tight">
                                {item.title}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-cream-dark/40">
                            <input 
                              type="datetime-local" 
                              value={draftDates[item.id] || ''}
                              onChange={(e) => setDraftDates(prev => ({...prev, [item.id]: e.target.value}))}
                              className="flex-1 bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-800 text-[10px] rounded px-2 py-1.5 focus:outline-none font-mono"
                            />
                            <button
                              onClick={() => handleScheduleDraft(item)}
                              className="px-3 py-1.5 bg-espresso hover:bg-terracotta text-cream hover:text-white rounded text-[9px] font-mono font-bold uppercase tracking-wider transition-colors whitespace-nowrap"
                            >
                              Schedule
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : activeTab === 'scheduled' ? (
                  /* SCHEDULED TAB */
                  scheduledItems.length === 0 ? (
                    <div className="py-8 text-center text-stone-400 text-xs font-sans">No items scheduled.</div>
                  ) : (
                    <div className="space-y-3">
                      {scheduledItems.map(item => {
                        const lDate = item.scheduled_for ? parseISO(item.scheduled_for) : new Date();
                        const isPast = isBefore(lDate, new Date());
                        return (
                          <div key={`${item.type}-${item.id}`} className="p-3 rounded-lg border border-terracotta/30 bg-terracotta/5 shadow-3xs space-y-2 text-left">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-[8px] font-mono uppercase bg-terracotta/20 text-terracotta px-1.5 py-0.5 rounded font-extrabold mb-1 inline-block">
                                  {item.type} • {item.category}
                                </span>
                                <h4 className="font-serif font-bold text-sm text-espresso line-clamp-1">
                                  {item.title}
                                </h4>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-stone-600 font-mono text-[9px] pt-1">
                              <span className="flex items-center gap-1 font-bold text-terracotta">
                                <Clock className="w-3 h-3" />
                                {format(lDate, 'MMM dd, HH:mm')} Local
                              </span>
                              <button
                                onClick={() => handleUpdateStatus(item, 'draft')}
                                className="text-stone-500 hover:text-[#E60023] uppercase text-[9px] font-extrabold transition-colors border border-stone-200 hover:border-[#E60023] px-2 py-1 rounded bg-white"
                              >
                                Unschedule
                              </button>
                            </div>
                            
                            {isPast && (
                              <div className="text-[8.5px] font-sans text-yellow-700 bg-yellow-400/20 p-1.5 rounded flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 text-yellow-600" />
                                <span>Awaiting auto-publish.</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* LIVE TAB */
                  publishedItems.length === 0 ? (
                    <div className="py-8 text-center text-stone-400 text-xs font-sans">No published items.</div>
                  ) : (
                    <div className="space-y-3">
                      {publishedItems.map(item => (
                        <div key={`${item.type}-${item.id}`} className="p-3 rounded-lg border border-sage/30 bg-sage/5 shadow-3xs space-y-2 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[8px] font-mono uppercase bg-sage/20 text-sage-dark px-1.5 py-0.5 rounded font-extrabold mb-1 inline-block">
                                {item.type} • {item.category}
                              </span>
                              <h4 className="font-serif font-bold text-sm text-espresso line-clamp-1">
                                {item.title}
                              </h4>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-stone-600 font-mono text-[9px] pt-1 border-t border-sage/20">
                            <span className="flex items-center gap-1 font-bold text-sage-dark">
                              <CheckCircle2 className="w-3 h-3" />
                              Live {item.published_at ? format(parseISO(item.published_at), 'MMM dd') : ''}
                            </span>
                            <button
                              onClick={() => handleUpdateStatus(item, 'draft')}
                              className="text-stone-500 hover:text-[#E60023] uppercase text-[9px] font-extrabold transition-colors border border-stone-200 hover:border-[#E60023] px-2 py-1 rounded bg-white"
                            >
                              Unpublish
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
