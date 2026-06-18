'use client';

import React from 'react';
import { LAYOUT_TEMPLATES, getTemplate, LayoutTemplate } from '@/lib/templates/registry';
import { Image, Layout, Layers, Grid, FileImage } from 'lucide-react';

interface TemplateImageSlot {
  slot: number;
  url: string;
  blur_hash: string;
  caption: string;
}

interface TemplatePickerProps {
  selectedTemplate: string;
  onChangeTemplate: (id: string) => void;
  templateImages: TemplateImageSlot[];
  onChangeImages: (images: TemplateImageSlot[]) => void;
}

export default function TemplatePicker({
  selectedTemplate,
  onChangeTemplate,
  templateImages,
  onChangeImages,
}: TemplatePickerProps) {
  const currentTemplate = getTemplate(selectedTemplate);

  const handleTemplateSelect = (id: string) => {
    onChangeTemplate(id);
    const targetTemplate = getTemplate(id);
    
    // Resize array to match required slot density
    const updatedImages = [...templateImages];
    const needed = targetTemplate.imageSlots;

    if (updatedImages.length > needed) {
      onChangeImages(updatedImages.slice(0, needed));
    } else if (updatedImages.length < needed) {
      for (let s = updatedImages.length + 1; s <= needed; s++) {
        updatedImages.push({
          slot: s,
          url: '',
          blur_hash: '',
          caption: '',
        });
      }
      onChangeImages(updatedImages);
    }
  };

  const handleImageFieldChange = (slotNum: number, field: keyof TemplateImageSlot, value: string) => {
    const updated = templateImages.map((img) => {
      if (img.slot === slotNum) {
        return { ...img, [field]: value };
      }
      return img;
    });

    // Make sure slot exists
    if (!updated.some((img) => img.slot === slotNum)) {
      updated.push({
        slot: slotNum,
        url: field === 'url' ? value : '',
        blur_hash: field === 'blur_hash' ? value : '',
        caption: field === 'caption' ? value : '',
      });
    }

    onChangeImages(updated);
  };

  return (
    <div className="space-y-6 text-left" id="admin-template-picker-container">
      <div className="space-y-1">
        <label className="block text-xs font-mono font-bold uppercase tracking-wider text-espresso">
          1. Select Culinary Layout Style
        </label>
        <p className="text-[11px] text-stone-500 font-sans">
          Each template adapts the visual flow of imagery, captions, and text columns dynamically.
        </p>
      </div>

      {/* Grid of Templates cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="template-sheets-grid">
        {LAYOUT_TEMPLATES.map((tpl: LayoutTemplate) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => handleTemplateSelect(tpl.id)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? 'border-terracotta bg-terracotta/5 shadow-xs'
                  : 'border-cream-dark hover:border-stone-400 bg-white hover:bg-cream-light/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-serif font-bold text-xs uppercase tracking-tight text-espresso leading-none">
                  {tpl.name}
                </span>
                <span className="font-mono text-[8px] font-bold uppercase py-0.5 px-1.5 rounded bg-cream text-stone-605">
                  {tpl.imageSlots} {tpl.imageSlots === 1 ? 'Slot' : 'Slots'}
                </span>
              </div>
              <p className="text-[10px] text-stone-500 pt-2 pb-3 font-sans leading-relaxed">
                {tpl.description}
              </p>
              <div className="border-t border-cream-dark/60 pt-2">
                <span className="text-[8px] font-mono text-sage font-bold uppercase">
                  Best For: <span className="text-stone-600">{tpl.bestFor}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Inputs reflecting target layout spacing density */}
      {currentTemplate.imageSlots > 0 && (
        <div className="pt-4 border-t border-cream-dark space-y-4" id="target-layout-slots-inputs">
          <div className="space-y-1">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-espresso">
              2. Image Asset Channels ({currentTemplate.imageSlots} Required)
            </h4>
            <p className="text-[10px] text-stone-500 font-sans">
              Provide premium curated photo URLs from Unsplash, Pixabay or your private storage CDN.
            </p>
          </div>

          <div className="space-y-4">
            {Array.from({ length: currentTemplate.imageSlots }).map((_, idx) => {
              const slotNum = idx + 1;
              const slotData = templateImages.find((img) => img.slot === slotNum) || {
                slot: slotNum,
                url: '',
                blur_hash: '',
                caption: '',
              };

              return (
                <div
                  key={slotNum}
                  className="p-4 rounded-xl bg-white border border-cream-dark space-y-3.5 shadow-2xs text-left"
                >
                  <div className="flex items-center gap-1.5 text-espresso border-b border-cream-dark pb-2">
                    <FileImage className="w-3.5 h-3.5 text-sage" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                      Visual Channel Slot #{slotNum} {slotNum === 1 ? '(Root Banner)' : ''}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* URL */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">
                        Image Resource path (URL)
                      </label>
                      <input
                        type="url"
                        required={slotNum === 1}
                        placeholder="https://images.unsplash.com/photo-..."
                        value={slotData.url}
                        onChange={(e) => handleImageFieldChange(slotNum, 'url', e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none"
                      />
                    </div>

                    {/* Caption */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">
                        Visual Title tag / Caption
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Goldening crust under natural steam"
                        value={slotData.caption}
                        onChange={(e) => handleImageFieldChange(slotNum, 'caption', e.target.value)}
                        className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Optional Blur Hash */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="block text-[10px] font-mono font-bold uppercase text-stone-600">
                        Lighthouse BlurHash Signature (Optional)
                      </label>
                      <span className="text-[8px] font-mono text-stone-400">e.g. LfGj?#t7_Nof_4ofWBfQxuWB</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Input the precomputed blur_hash string"
                      value={slotData.blur_hash}
                      onChange={(e) => handleImageFieldChange(slotNum, 'blur_hash', e.target.value)}
                      className="w-full bg-[#FAF9F5] border border-cream-dark focus:border-terracotta text-stone-800 text-xs rounded-lg px-3 py-2 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
