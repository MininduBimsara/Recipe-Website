'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, Clock, Sparkles, RefreshCw, Play, CheckCircle2, 
  FileText, ArrowLeft, AlertCircle, Settings, ChevronLeft, ChevronRight, CheckCircle 
} from 'lucide-react';
import { getScheduleBacklogAction, runAutoPublishSimulationAction, updateReleaseScheduleAction } from '@/lib/actions/schedule';
import { toast } from 'react-hot-toast';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isBefore } from 'date-fns';

export default function AdminSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [backlog, setBacklog] = useState<any[]>([]);
  const [simulating, setSimulating] = useState(false);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 5, 1)); // June 2026

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

  const handleUnschedule = async (item: any) => {
    const ok = window.confirm(`Revert "${item.title}" back to draft state?`);
    if (!ok) return;

    try {
      const res = await updateReleaseScheduleAction(item.type, item.id, { status: 'draft' });
      if (res.success) {
        toast.success(`Successfully reverted "${item.title}" to local draft list.`);
        fetchBacklog();
      } else {
        toast.error(res.error || 'Update failed.');
      }
    } catch (err) {
      toast.error('Update operation crashed.');
    }
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
    <div className="w-full min-h-screen bg-[#FAFAF8] text-espresso py-10 px-6 select-none" id="admin-schedule-agenda-view">
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
            Savory release calendar
          </span>
        </div>

        {/* Header Masthead */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-cream-dark shadow-2xs">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-terracotta">
              <CalendarIcon className="w-5 h-5" />
              <h1 className="font-serif font-black text-2xl sm:text-3xl leading-none">
                Release Agenda & Calendar
              </h1>
            </div>
            <p className="text-xs text-stone-550 max-w-xl font-sans leading-relaxed">
              Program publication workflows across global time zones. Keep audiences engaged with a steady flow of sourdough recipes and tips.
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
              <span>Simulate Auto-Publish Engine</span>
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
            <h4 className="font-mono text-[9px] font-bold text-terracotta uppercase tracking-widest">Queued/Scheduled</h4>
            <span className="font-serif font-black text-xl text-terracotta">{scheduledItems.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-sage uppercase tracking-widest">Live/Published</h4>
            <span className="font-serif font-black text-xl text-sage">{publishedItems.length}</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-cream-dark text-left space-y-1 shadow-3xs">
            <h4 className="font-mono text-[9px] font-bold text-stone-400 uppercase tracking-widest font-extrabold text-stone-500">Drafts shelf</h4>
            <span className="font-serif font-black text-xl text-stone-540">{draftItems.length}</span>
          </div>
        </div>

        {/* Splitted Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar visual grid box (Left) */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-cream-dark shadow-2xs space-y-6">
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
                        ? 'bg-sage/5 border-sage font-extrabold' 
                        : (dayItems.length > 0 ? 'bg-terracotta/5 border-terracotta/40' : 'bg-[#FCFAF7]/40 border-cream-dark')
                    }`}
                  >
                    <span className={`text-[10px] font-mono ${
                      isToday ? 'text-sage font-black' : 'text-stone-500'
                    }`}>
                      {day.getDate()}
                    </span>

                    {dayItems.length > 0 && (
                      <div className="w-full flex items-center justify-end gap-1">
                        <div className="w-2 h-2 rounded-full bg-terracotta animate-pulse" title={`${dayItems.length} publications scheduled`} />
                        <span className="text-[8px] font-mono text-terracotta font-extrabold leading-none hidden sm:inline">
                          x{dayItems.length}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Backlog queue timeline list (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-cream-dark shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-cream-dark pb-2">
                <div className="text-left">
                  <h3 className="font-serif font-black text-sm text-espresso leading-none">
                    Distribution Queue
                  </h3>
                  <span className="text-[9px] font-mono text-stone-500 uppercase">Upcoming timely publications</span>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-stone-500 text-xs font-mono uppercase tracking-widest">
                  scanning distribution lines...
                </div>
              ) : scheduledItems.length === 0 ? (
                <div className="py-8 text-center bg-[#FCFAF7] border border-dashed border-cream-dark rounded-xl space-y-2">
                  <p className="text-xs text-stone-500 font-sans">No items currently queued.</p>
                  <p className="text-[10px] text-stone-400 font-sans max-w-[180px] mx-auto">Publish immediately or schedule items inside any edit screen pane.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {scheduledItems.map((item) => {
                    const lDate = item.scheduled_for ? parseISO(item.scheduled_for) : new Date();
                    const isPast = isBefore(lDate, new Date());

                    return (
                      <div 
                        key={`${item.type}-${item.id}`}
                        className="p-3 rounded-lg border border-cream-dark bg-[#FFFDFB] text-left space-y-2 shadow-3xs"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <span className="text-[8px] font-mono uppercase bg-terracotta/10 text-terracotta px-1.5 py-0.5 rounded font-extrabold">
                              #{item.category}
                            </span>
                            <h4 className="font-serif font-bold text-xs text-stone-900 line-clamp-1">
                              {item.title}
                            </h4>
                          </div>

                          <span className="text-[8px] font-mono text-stone-400 uppercase">
                            {item.type}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-stone-500 font-mono text-[9px] border-t border-cream-dark/40 pt-2">
                          <span className="flex items-center gap-0.5" title="Converted distribution target">
                            <Clock className="w-2.5 h-2.5 text-sage" />
                            {format(lDate, 'MMM dd, HH:mm')} UTC
                          </span>

                          <button
                            onClick={() => handleUnschedule(item)}
                            className="text-[#E60023] hover:underline uppercase text-[8px] font-extrabold"
                          >
                            Unschedule
                          </button>
                        </div>
                        
                        {isPast && (
                          <div className="text-[8.5px] font-sans text-yellow-700 bg-yellow-400/10 p-1.5 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-yellow-600" />
                            <span>Awaiting auto-publish run simulation.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick tips about auto simulation */}
            <div className="p-4 bg-sage/5 rounded-2xl border border-sage/20 text-left space-y-2">
              <span className="font-mono text-[9px] text-sage font-black uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Simulation Sandbox Guidance
              </span>
              <p className="text-[10.5px] text-stone-605 font-sans leading-relaxed">
                In a real-world environment, a background routine checks every minute (via <span className="font-semibold text-espresso">pg_cron</span> or similar cron tools) for entries scheduled in the past and publishes them automatically.
              </p>
              <p className="text-[10.5px] text-stone-605 font-sans leading-relaxed pt-1">
                Click <span className="font-bold text-espresso">"Simulate Auto-Publish Engine"</span> to instantly execute this check manually and see scheduled publications go live on your home channels!
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
