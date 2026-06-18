'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { convertLocalToUtcAction, convertUtcToLocalAction } from '@/lib/actions/schedule';
import { format, isBefore, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface PublishControlProps {
  currentStatus: 'draft' | 'scheduled' | 'published';
  onChangeStatus: (status: 'draft' | 'scheduled' | 'published') => void;
  scheduledFor: string | null; // ISO UTC String
  onChangeScheduledFor: (utcString: string | null) => void;
}

const COMMON_TIMEZONES = [
  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
  { value: 'America/New_York', label: 'Eastern Time (ET) - New York' },
  { value: 'America/Chicago', label: 'Central Time (CT) - Chicago' },
  { value: 'America/Denver', label: 'Mountain Time (MT) - Denver' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT) - Los Angeles' },
  { value: 'Europe/London', label: 'British Time (GMT/BST) - London' },
  { value: 'Europe/Paris', label: 'Central European Time (CET) - Paris' },
  { value: 'Asia/Tokyo', label: 'Japan Time (JST) - Tokyo' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET) - Sydney' },
];

export default function PublishControl({
  currentStatus,
  onChangeStatus,
  scheduledFor,
  onChangeScheduledFor,
}: PublishControlProps) {
  const [localDateTime, setLocalDateTime] = useState(''); // "YYYY-MM-DDTHH:MM"
  const [timezone, setTimezone] = useState('UTC');
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [utcSummary, setUtcSummary] = useState<string | null>(null);

  // 1. Initialize browser timezone on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (browserTz) {
          // Check if already in list, if not we add it dynamically so authors can use their own timezone perfectly
          const exists = COMMON_TIMEZONES.some(tz => tz.value === browserTz);
          if (!exists) {
            COMMON_TIMEZONES.unshift({ value: browserTz, label: `Local Browser Zone (${browserTz})` });
          }
          setTimezone(browserTz);
        }
      } catch (err) {
        console.warn('Could not auto-detect browser timezone:', err);
      }
    }
  }, []);

  // 2. Refresh UTC and validation states when state parameters update
  useEffect(() => {
    async function synchTimes() {
      if (currentStatus === 'scheduled') {
        if (scheduledFor) {
          const localInput = await convertUtcToLocalAction(scheduledFor, timezone);
          setLocalDateTime(localInput);
          setUtcSummary(scheduledFor);
          checkPastValidation(scheduledFor);
        } else {
          // Default to tomorrow at 12:00 PM local timezone
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(12, 0, 0, 0);

          const isoLocal = tomorrow.toISOString().slice(0, 16);
          setLocalDateTime(isoLocal);

          const utcIso = await convertLocalToUtcAction(isoLocal, timezone);
          onChangeScheduledFor(utcIso);
          setUtcSummary(utcIso);
          checkPastValidation(utcIso);
        }
      } else {
        setUtcSummary(null);
        setValidationWarning(null);
      }
    }
    synchTimes();
  }, [currentStatus, timezone]);

  const handleLocalChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalDateTime(val);
    if (!val) return;

    try {
      const utcIso = await convertLocalToUtcAction(val, timezone);
      onChangeScheduledFor(utcIso);
      setUtcSummary(utcIso);
      checkPastValidation(utcIso);
    } catch (err) {
      console.error('Error syncing local time change to UTC:', err);
    }
  };

  const checkPastValidation = (utcStr: string) => {
    const target = new Date(utcStr);
    const now = new Date();
    if (isBefore(target, now)) {
      setValidationWarning('⚠️ Warning: Scheduled release time is set in the past. This item will publish immediately on update.');
    } else {
      setValidationWarning(null);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-cream-dark bg-white space-y-4 shadow-3xs text-left" id="publish-control-card">
      <div className="flex items-center gap-2 border-b border-cream-dark pb-2 text-espresso">
        <Clock className="w-4 h-4 text-sage" />
        <div className="text-left">
          <h4 className="font-serif font-black text-sm leading-none">Release & Publishing Engine</h4>
          <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500">Distribution channels</span>
        </div>
      </div>

      {/* Select state radios */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2">
        {/* Draft */}
        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
          currentStatus === 'draft' 
            ? 'border-espresso bg-[#FCFAF7] font-bold' 
            : 'border-cream-dark hover:border-stone-400'
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="publishStatus"
              value="draft"
              checked={currentStatus === 'draft'}
              onChange={() => {
                onChangeStatus('draft');
                onChangeScheduledFor(null);
              }}
              className="accent-espresso cursor-pointer"
            />
            <span className="text-xs font-serif text-espresso leading-none">Draft Mode</span>
          </div>
          <span className="text-[9px] text-stone-500 pt-1 font-sans">Saves offline shelf</span>
        </label>

        {/* Scheduled */}
        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
          currentStatus === 'scheduled' 
            ? 'border-terracotta bg-terracotta/5 font-bold' 
            : 'border-cream-dark hover:border-stone-400'
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="publishStatus"
              value="scheduled"
              checked={currentStatus === 'scheduled'}
              onChange={() => onChangeStatus('scheduled')}
              className="accent-terracotta cursor-pointer"
            />
            <span className="text-xs font-serif text-espresso leading-none">Scheduled</span>
          </div>
          <span className="text-[9px] text-stone-500 pt-1 font-sans">Timed public launch</span>
        </label>

        {/* Publish immediately */}
        <label className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
          currentStatus === 'published' 
            ? 'border-sage bg-sage/5 font-bold' 
            : 'border-cream-dark hover:border-stone-400'
        }`}>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="publishStatus"
              value="published"
              checked={currentStatus === 'published'}
              onChange={() => {
                onChangeStatus('published');
                onChangeScheduledFor(null);
              }}
              className="accent-sage cursor-pointer"
            />
            <span className="text-xs font-serif text-espresso leading-none">Release Now</span>
          </div>
          <span className="text-[9px] text-stone-500 pt-1 font-sans">Immediate public gazette</span>
        </label>
      </div>

      {/* Date controls for Scheduled status */}
      {currentStatus === 'scheduled' && (
        <div className="space-y-4 p-4 rounded-xl bg-cream-light/30 border border-cream-dark/60 animate-fade-in" id="scheduling-picker-drawer">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Picker */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-terracotta" /> Launch Date & Time
              </label>
              <input
                type="datetime-local"
                value={localDateTime}
                onChange={handleLocalChange}
                className="w-full bg-white border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none"
              />
            </div>

            {/* Timezone Selection */}
            <div className="space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-stone-600 flex items-center gap-1">
                <Globe className="w-3 h-3 text-sage" /> Target Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-white border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
              >
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Validation past warning */}
          {validationWarning && (
            <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-800 rounded-lg text-[10.5px] font-sans flex items-start gap-1.5 leading-relaxed">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-yellow-600" />
              <span>{validationWarning}</span>
            </div>
          )}

          {/* Realtime Conversion Summary Box */}
          {utcSummary && (
            <div className="p-3 bg-white rounded-lg border border-cream-dark space-y-1.5 font-mono text-[10.5px] text-stone-701">
              <div className="flex justify-between border-b border-cream-dark/40 pb-1">
                <span className="font-bold text-espresso uppercase">Release Summary:</span>
                <span className="text-sage font-extrabold uppercase">• CONVERTED</span>
              </div>
              <div className="flex justify-between pt-0.5">
                <span>Selected Local time:</span>
                <span className="text-stone-900 font-bold">
                  {localDateTime ? localDateTime.replace('T', ' ') : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Calculated UTC storage:</span>
                <span className="text-terracotta font-extrabold">
                  {format(parseISO(utcSummary), 'yyyy-MM-dd HH:mm')} UTC
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
