import React from 'react';
import { Tone } from '../types';

interface SettingsPanelProps {
  hotelName: string;
  setHotelName: (val: string) => void;
  tone: Tone;
  setTone: (val: Tone) => void;
  context: string;
  setContext: (val: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  hotelName,
  setHotelName,
  tone,
  setTone,
  context,
  setContext
}) => {
  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 bg-slate-50/50 dark:bg-slate-800/50">
        <span className="material-symbols-outlined text-slate-400">tune</span>
        <h2 className="font-semibold text-slate-800 dark:text-white">Settings</h2>
      </div>
      
      <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Hotel Name</label>
          <input 
            className="w-full rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow placeholder:text-slate-400 outline-none" 
            type="text" 
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tone of Voice</label>
          <div className="relative">
            <select 
              className="w-full appearance-none bg-none rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow cursor-pointer outline-none"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              {Object.values(Tone).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 text-slate-500 pointer-events-none text-[20px]">expand_more</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-h-[160px]">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between items-center">
            Context / Knowledge Base
            <span className="text-xs font-normal text-slate-500">Optional</span>
          </label>
          <textarea 
            className="w-full flex-1 rounded-lg border-slate-300 bg-slate-50 dark:bg-slate-800 dark:border-slate-600 text-slate-900 dark:text-white px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-shadow resize-none placeholder:text-slate-400 leading-relaxed outline-none" 
            placeholder="Add context specific to this review (e.g. 'Pool is under maintenance until July 1st')..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">System Prompt Preview</p>
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
            <p className="font-mono text-[10px] leading-4 text-slate-600 dark:text-slate-400">
              <span className="text-primary font-bold">Role:</span> Hotel Response Agent<br/>
              <span className="text-primary font-bold">Tone:</span> {tone}<br/>
              <span className="text-primary font-bold">Context:</span> [User Input Data]<br/>
              <span className="text-green-600">{'>>'}</span> Draft a reply addressing all points...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};