import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SettingsPanel } from './components/SettingsPanel';
import { ReviewPanel } from './components/ReviewPanel';
import { DraftPanel } from './components/DraftPanel';
import { HelpModal } from './components/HelpModal';
import { streamReply, generateSelectionReply } from './services/geminiService';
import { Tone } from './types';

const INITIAL_REVIEW = `The room view was amazing, but the check-in queue was too long (over 30 mins). Also, I didn't know the swimming pool was closed.`;
const INITIAL_CONTEXT = `Pool maintenance: Closed June 15-20. 
Compensation policy: Free breakfast for complaints regarding wait times > 20 mins.`;

const App: React.FC = () => {
  const [hotelName, setHotelName] = useState('Shanghai Hilton Hotel');
  const [tone, setTone] = useState<Tone>(Tone.Smart);
  const [context, setContext] = useState(INITIAL_CONTEXT);
  const [reviewText, setReviewText] = useState(INITIAL_REVIEW);
  
  const [draft, setDraft] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleGenerateFull = useCallback(async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setDraft(''); // Clear previous draft

    await streamReply({
      hotelName,
      tone,
      context,
      reviewText
    }, (chunk) => {
      setDraft((prev) => prev + chunk);
    });
    
    setIsGenerating(false);
  }, [hotelName, tone, context, reviewText, isGenerating]);

  const handleReplyToSelection = useCallback(async (selection: string) => {
    setIsGenerating(true);
    // Optimistic UI update or notification could go here
    const snippet = await generateSelectionReply(selection, {
      hotelName,
      tone,
      context,
      reviewText
    });
    
    setDraft((prev) => {
        // Append cleanly
        const prefix = prev ? prev + '\n\n' : '';
        return prefix + snippet;
    });
    setIsGenerating(false);
  }, [hotelName, tone, context, reviewText]);

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark">
      <Header onHelpClick={() => setIsHelpOpen(true)} />
      
      <main className="flex-1 overflow-hidden">
        <div className="h-full w-full max-w-[1600px] mx-auto p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            
            {/* Left Column: Settings */}
            <div className="lg:col-span-3 h-full overflow-hidden">
              <SettingsPanel 
                hotelName={hotelName}
                setHotelName={setHotelName}
                tone={tone}
                setTone={setTone}
                context={context}
                setContext={setContext}
              />
            </div>
            
            {/* Center Column: Review Input */}
            <div className="lg:col-span-5 h-full overflow-hidden">
              <ReviewPanel 
                reviewText={reviewText}
                setReviewText={setReviewText}
                onGenerateFull={handleGenerateFull}
                onReplyToSelection={handleReplyToSelection}
                isGenerating={isGenerating}
              />
            </div>
            
            {/* Right Column: Draft Output */}
            <div className="lg:col-span-4 h-full flex flex-col gap-6 overflow-hidden">
              <DraftPanel 
                draft={draft}
                isGenerating={isGenerating}
                onRegenerate={handleGenerateFull}
              />
              
              {/* Skeleton / Variants Logic (Visual only for now) */}
              {isGenerating && (
                <div className="opacity-60 pointer-events-none select-none shrink-0 mb-4">
                    <div className="flex items-center gap-2 mb-2 px-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span className="text-xs font-medium text-slate-500">Processing...</span>
                    </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </main>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;