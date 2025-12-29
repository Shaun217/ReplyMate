import React from 'react';

interface HeaderProps {
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="h-16 bg-surface-light dark:bg-surface-dark border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-6 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-sm shadow-primary/30">
          <span className="material-symbols-outlined text-[20px]">forum</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ReplyMate</h1>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={onHelpClick}
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span className="hidden sm:inline">Help</span>
        </button>
      </div>
    </header>
  );
};