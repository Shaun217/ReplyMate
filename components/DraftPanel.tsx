import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface DraftPanelProps {
  draft: string;
  isGenerating: boolean;
  onRegenerate: () => void;
}

export const DraftPanel: React.FC<DraftPanelProps> = ({
  draft,
  isGenerating,
  onRegenerate
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">description</span>
          <h2 className="font-semibold text-slate-800 dark:text-white">Draft Reply</h2>
        </div>
        <div className="flex gap-1">
          {/* Kept edit button as requested, removed top copy button to avoid redundancy */}
          <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-500 transition-colors" title="Edit Manually">
            <span className="material-symbols-outlined text-[18px]">edit</span>
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar bg-white dark:bg-surface-dark">
        {draft ? (
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
             <ReactMarkdown>{draft}</ReactMarkdown>
          </div>
        ) : (
           <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <span className="material-symbols-outlined text-4xl mb-2 opacity-50">article</span>
               <p className="text-sm">Generated reply will appear here</p>
           </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
        <button 
          onClick={onRegenerate}
          disabled={isGenerating || !draft}
          className="flex-1 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 font-medium py-2.5 rounded-lg shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">refresh</span>
          Regenerate
        </button>
        <button 
            onClick={handleCopy}
            disabled={!draft}
            className="flex-1 flex items-center justify-center gap-2 text-white bg-slate-900 dark:bg-slate-600 hover:bg-slate-800 dark:hover:bg-slate-500 font-medium py-2.5 rounded-lg shadow-sm transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? 'check' : 'content_copy'}
          </span>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </section>
  );
};