import React, { useState, useRef, useCallback } from 'react';
import { SelectionData } from '../types';

interface ReviewPanelProps {
  reviewText: string;
  setReviewText: (val: string) => void;
  onGenerateFull: () => void;
  onReplyToSelection: (selection: string) => void;
  isGenerating: boolean;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  reviewText,
  setReviewText,
  onGenerateFull,
  onReplyToSelection,
  isGenerating
}) => {
  const [selectionData, setSelectionData] = useState<SelectionData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Cleaned up handleSelection to remove unused variables
  const handleSelection = useCallback(() => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Only functionality needed here is to clear selection if cursor is just clicked
    if (start === end) {
      setSelectionData(null);
    }
  }, []);

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    
    // Tiny timeout to let selection settle
    setTimeout(() => {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start !== end) {
             const selectedText = textarea.value.substring(start, end).trim();
             if (selectedText.length > 0) {
                 // Calculate position relative to the container
                 const containerRect = containerRef.current?.getBoundingClientRect();
                 if(containerRect) {
                     const top = e.clientY - containerRect.top - 40; // 40px above cursor
                     const left = e.clientX - containerRect.left;
                     
                     setSelectionData({
                         text: selectedText,
                         top: top,
                         left: left
                     });
                 }
             }
        } else {
            setSelectionData(null);
        }
    }, 10);
  };

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectionData) {
      onReplyToSelection(selectionData.text);
      setSelectionData(null); // Clear selection after action
    }
  };

  return (
    <section 
      ref={containerRef}
      className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full relative group overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">rate_review</span>
          <h2 className="font-semibold text-slate-800 dark:text-white">Guest Review</h2>
        </div>
      </div>
      
      <div className="p-0 flex-1 relative flex flex-col">
        <textarea 
          ref={textareaRef}
          className="w-full flex-1 p-5 text-base leading-relaxed text-slate-700 dark:text-slate-200 outline-none focus:bg-slate-50/50 dark:focus:bg-slate-800/30 transition-colors bg-transparent resize-none border-none ring-0 focus:ring-0"
          spellCheck={false}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          onSelect={handleSelection}
          onMouseUp={handleMouseUp}
          placeholder="Paste guest review here..."
        />
        
        {/* Floating Button */}
        {selectionData && (
          <div 
            className="absolute z-10 animate-in"
            style={{ 
                top: `${Math.max(10, selectionData.top)}px`, 
                left: `${Math.min(selectionData.left, (containerRef.current?.offsetWidth || 500) - 160)}px` 
            }}
          >
            <button 
              onClick={handleReplyClick}
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-1.5 px-3 rounded-full shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Reply to selection
            </button>
            <div className="w-2 h-2 bg-primary rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
          </div>
        )}

        <div className="p-5 absolute bottom-0 left-0 right-0 pointer-events-none">
          <button 
            onClick={onGenerateFull}
            disabled={isGenerating || !reviewText.trim()}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium h-12 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] pointer-events-auto"
          >
            {isGenerating ? (
               <>
                 <span className="material-symbols-outlined animate-spin">progress_activity</span>
                 Generating...
               </>
            ) : (
               <>
                 <span className="material-symbols-outlined">auto_awesome</span>
                 Generate Full Reply
               </>
            )}
          </button>
        </div>
        {/* Spacer for bottom button */}
        <div className="h-20 shrink-0"></div>
      </div>
    </section>
  );
};