'use client';

import React, { useState } from 'react';
import { MailCheck, RefreshCw, AlertTriangle, Send } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const tempErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      tempErrors.name = 'Your name is required to address you.';
    }
    if (!formData.email.trim()) {
      tempErrors.email = 'An email address is required so we can reply.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject) {
      tempErrors.subject = 'Please select what your message is about.';
    }
    if (!formData.message.trim()) {
      tempErrors.message = 'Please write down some details.';
    } else if (formData.message.trim().length < 20) {
      tempErrors.message = 'Please provide a more descriptive message (minimum 20 characters).';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear individual error as they type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(data.error || 'Server rejected the submission.');
      }
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage('Network error: Could not reach the culinary servers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-sage/40 rounded-3xl p-8 text-center space-y-6 shadow-sm" id="contact-success-block">
        <div className="mx-auto w-14 h-14 bg-sage/15 text-sage rounded-full flex items-center justify-center animate-bounce">
          <MailCheck className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-xl text-espresso dark:text-cream">Message Sent Successfully!</h3>
          <p className="text-xs sm:text-sm text-stone-605 dark:text-stone-300 leading-relaxed max-w-sm mx-auto">
            I appreciate you reaching out. I read everything personally and will get back to you within 48 hours.
          </p>
        </div>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-espresso dark:bg-stone-800 hover:bg-terracotta text-white font-mono text-[10px] uppercase font-bold tracking-widest rounded-xl transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Send another message</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1E1E1E] border border-cream-dark dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-3xs" noValidate id="contact-interactive-form">
      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-4 flex items-start gap-2.5 text-left">
          <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-600 dark:text-red-300 space-y-1">
            <p className="font-bold">Message failed to deliver</p>
            <p className="leading-relaxed">
              {errorMessage || 'Something went wrong. Please email directly at minindubim@gmail.com'}
            </p>
          </div>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="name" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          Your name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Jane Smith"
          value={formData.name}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className={`w-full bg-[#FAF9F5] dark:bg-stone-900 border ${
            errors.name ? 'border-red-500' : 'border-cream-dark dark:border-stone-750'
          } focus:outline-hidden focus-visible:ring-1 focus-visible:ring-terracotta rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-800 dark:text-cream placeholder:text-stone-400`}
        />
        {errors.name && <p className="text-[11px] text-red-600 dark:text-red-400 font-medium pl-1">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="email" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          Your email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className={`w-full bg-[#FAF9F5] dark:bg-stone-900 border ${
            errors.email ? 'border-red-500' : 'border-cream-dark dark:border-stone-750'
          } focus:outline-hidden focus-visible:ring-1 focus-visible:ring-terracotta rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-800 dark:text-cream placeholder:text-stone-400`}
        />
        {errors.email && <p className="text-[11px] text-red-600 dark:text-red-400 font-medium pl-1">{errors.email}</p>}
      </div>

      {/* Subject Selector */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="subject" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          What&apos;s this about?
        </label>
        <div className="relative">
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            disabled={isSubmitting}
            className={`w-full bg-[#FAF9F5] dark:bg-stone-900 border appearance-none ${
              errors.subject ? 'border-red-500' : 'border-cream-dark dark:border-stone-750'
            } focus:outline-hidden focus-visible:ring-1 focus-visible:ring-terracotta rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-800 dark:text-cream`}
          >
            <option value="">-- Choose option --</option>
            <option value="Recipe question">Recipe question & adjustments</option>
            <option value="Collaboration enquiry">Collaboration or Sponsorship enquiry</option>
            <option value="Media / press">Media & Press details</option>
            <option value="Something else">Something else</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {errors.subject && <p className="text-[11px] text-red-600 dark:text-red-400 font-medium pl-1">{errors.subject}</p>}
      </div>

      {/* Message Field */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="message" className="block text-xs font-mono font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="Tell me what's on your mind... (minimum 20 characters)"
          value={formData.message}
          onChange={handleInputChange}
          disabled={isSubmitting}
          className={`w-full bg-[#FAF9F5] dark:bg-stone-900 border resize-y ${
            errors.message ? 'border-red-500' : 'border-cream-dark dark:border-stone-750'
          } focus:outline-hidden focus-visible:ring-1 focus-visible:ring-terracotta rounded-xl px-4 py-3 text-xs sm:text-sm text-stone-800 dark:text-cream placeholder:text-stone-400`}
        />
        {errors.message && <p className="text-[11px] text-red-600 dark:text-red-400 font-medium pl-1">{errors.message}</p>}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-espresso hover:bg-terracotta disabled:bg-stone-400 text-white dark:text-[#E2DED5] rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-terracotta hover:shadow-md"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Mixing message dough...</span>
            </>
          ) : (
            <>
              <span>Send message</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
