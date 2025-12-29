import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop click handler */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-surface-dark w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
             </div>
             <h2 className="text-lg font-bold text-slate-800 dark:text-white">User Guide</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
            
            <h3>🚀 How to use ReplyMate</h3>
            <ol>
              <li>
                <strong>Configure Settings:</strong>
                <p>Enter your Hotel Name and select a Tone (e.g., <em>Smart, Professional, Empathetic</em>). Use the <strong>Context</strong> field to add specific facts (e.g., "Pool is closed until Tuesday")—the AI will include this in the reply.</p>
              </li>
              <li>
                <strong>Input Review:</strong>
                <p>Paste the guest's comment into the middle <strong>Guest Review</strong> panel.</p>
              </li>
              <li>
                <strong>Generate Reply:</strong>
                <ul>
                  <li>Click <strong>Generate Full Reply</strong> to create a complete response.</li>
                  <li><strong>Pro Tip:</strong> Select specific text within the review (highlight it with your mouse) and click the floating <strong>"Reply to selection"</strong> button to generate a quick response just for that point.</li>
                </ul>
              </li>
              <li>
                <strong>Finalize:</strong>
                <p>The draft appears on the right. You can edit it manually if needed, or click <strong>Regenerate</strong> to try again. Use the <strong>Copy</strong> button to save it to your clipboard.</p>
              </li>
            </ol>

            <hr className="my-6 border-slate-200 dark:border-slate-700" />

            <h3>✨ Features</h3>
            <ul>
              <li><strong>Context-Aware AI:</strong> Powered by Google Gemini, it understands your hotel's policies and specific situation.</li>
              <li><strong>Native Language Detection:</strong> The AI automatically detects the language of the review and replies in the same language with native fluency.</li>
              <li><strong>OTA Optimized:</strong> Generates concise, direct replies suitable for platforms like Booking.com or Expedia (no "Dear Sir/Madam" letter formats).</li>
              <li><strong>Smart Selection:</strong> Highlight specific complaints to address them individually.</li>
            </ul>

          </div>
          
          <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">About</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              ReplyMate Version 1.0.0<br/>
              Built with Next.js, Tailwind CSS, and Google Gemini.<br/>
              Designed to streamline hotel guest communication.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};