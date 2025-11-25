
import React, { useState, useEffect } from 'react';
import { Lesson, UnderstandingLevel } from '../types';
import { CheckCircle, HelpCircle, ArrowRight, Bot, Book, Terminal, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { simplifyLesson } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface LessonReaderProps {
  lesson: Lesson;
  onComplete: (understanding: UnderstandingLevel) => void;
  onBack: () => void;
  onNext?: () => void;
  hasNext?: boolean;
  onPrev?: () => void;
  hasPrev?: boolean;
}

const LessonReader: React.FC<LessonReaderProps> = ({ lesson, onComplete, onBack, onNext, hasNext, onPrev, hasPrev }) => {
  const [understanding, setUnderstanding] = useState<UnderstandingLevel>(UnderstandingLevel.NOT_SET);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Force scroll to top when lesson loads
  useEffect(() => {
    const scrollContainer = document.getElementById('app-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      setTimeout(() => {
        scrollContainer.scrollTop = 0;
      }, 50);
    }
    window.scrollTo(0, 0);
    
    // Reset state for new lesson
    setUnderstanding(UnderstandingLevel.NOT_SET);
    setAiSummary(null);
  }, [lesson.id]);

  const handleUnderstanding = async (level: UnderstandingLevel) => {
    setUnderstanding(level);
    
    if (level === UnderstandingLevel.NOT_UNDERSTOOD) {
      setIsLoadingAi(true);
      const summary = await simplifyLesson(lesson.content);
      if (summary) {
        setAiSummary(summary);
      }
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden font-cairo shadow-2xl mb-20 animate-fade-in">
      {/* Header */}
      <div className="bg-slate-950 p-4 md:p-6 border-b border-slate-800 sticky top-0 z-10 backdrop-blur-md bg-opacity-95 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all"
            title="العودة للقائمة"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-lg md:text-2xl font-bold text-white mb-1 leading-tight line-clamp-1">{lesson.title}</h2>
            <div className="flex gap-2 text-xs text-slate-400 items-center">
              <span className="px-2 py-0.5 bg-emerald-900/30 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1">
                <Terminal className="w-3 h-3" />
                محتوى تعليمي
              </span>
              <span className="px-2 py-0.5 bg-blue-900/20 text-blue-400 border border-blue-500/20 rounded font-mono" dir="ltr">+ {lesson.xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-10 text-slate-300 leading-loose space-y-6 text-right bg-slate-900 min-h-[60vh]">
        
        {/* React Markdown for proper link and code rendering */}
        <ReactMarkdown
          className="prose prose-invert max-w-none prose-headings:font-cairo prose-p:text-slate-300 prose-p:text-lg prose-li:text-slate-300 prose-strong:text-white prose-strong:font-bold"
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500 my-8 pb-4 border-b border-slate-800" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl md:text-2xl font-bold text-white mt-10 mb-4 flex items-center gap-2 border-r-4 border-emerald-500 pr-3 bg-slate-800/30 py-2 rounded-l-lg" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg md:text-xl font-bold text-emerald-400 mt-6 mb-2" {...props} />,
            a: ({node, ...props}) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1 my-1 bg-blue-600/10 text-blue-300 border border-blue-500/30 rounded-lg hover:bg-blue-600 hover:text-white transition-all no-underline text-xs md:text-sm"
              >
                <ExternalLink className="w-3 h-3" />
                {props.children}
              </a>
            ),
            code: ({node, ...props}) => {
               const isBlock = String(props.children).includes('\n');
               return isBlock ? (
                 <div dir="ltr" className="relative group my-6">
                   <div className="absolute -top-3 right-4 bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded border border-slate-700 font-mono">CODE</div>
                   <div className="bg-[#0d1117] p-4 rounded-xl border border-slate-800 font-mono text-sm text-emerald-400 shadow-inner overflow-x-auto whitespace-pre">
                     {props.children}
                   </div>
                 </div>
               ) : (
                 <code className="bg-slate-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-sm mx-1 border border-slate-700 shadow-sm" {...props} />
               )
            },
            ul: ({node, ...props}) => <ul className="list-disc pr-6 space-y-3 my-4 marker:text-emerald-500" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pr-6 space-y-3 my-4 marker:text-emerald-500" {...props} />,
            li: ({node, ...props}) => <li className="pl-2" {...props} />,
            blockquote: ({node, ...props}) => (
              <blockquote className="border-r-4 border-blue-500 bg-blue-900/10 p-4 my-6 rounded-l-lg italic text-slate-300" {...props} />
            ),
            p: ({node, ...props}) => <p className="mb-4 text-base md:text-lg leading-8" {...props} />
          }}
        >
          {lesson.content}
        </ReactMarkdown>

        {lesson.bookReference && (
            <div className="mt-12 p-5 bg-slate-800/50 border border-slate-700 rounded-xl flex items-start gap-4">
                <div className="bg-blue-500/10 p-3 rounded-xl">
                    <Book className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                    <p className="text-sm text-slate-400 font-bold mb-1">مرجع للمطالعة المتعمقة:</p>
                    <p className="text-base text-white font-medium">{lesson.bookReference}</p>
                </div>
            </div>
        )}
      </div>

      {aiSummary && (
        <div className="mx-4 md:mx-6 mb-6 p-5 bg-violet-500/5 border border-violet-500/20 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-violet-400 border-b border-violet-500/10 pb-2">
            <Bot className="w-5 h-5" />
            <span className="font-bold text-sm">ملخص المعلم الذكي</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{aiSummary}</p>
        </div>
      )}

      {isLoadingAi && !aiSummary && (
         <div className="mx-6 mb-6 flex justify-center p-4">
            <div className="text-sm text-violet-400 animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-violet-400 rounded-full"></span>
                جاري تحليل المحتوى وتبسيطه...
            </div>
         </div>
      )}

      {/* Footer / Actions */}
      <div className="p-6 md:p-8 bg-slate-950 border-t border-slate-800">
        <h3 className="text-center text-slate-500 text-sm mb-6 uppercase tracking-wider font-bold">
          هل استوعبت هذا الدرس؟
        </h3>
        
        {understanding === UnderstandingLevel.NOT_SET ? (
          <div className="grid grid-cols-1 gap-4 max-w-sm mx-auto">
            <button 
              onClick={() => handleUnderstanding(UnderstandingLevel.UNDERSTOOD)}
              className="w-full p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-900/20 font-bold text-lg"
            >
              <CheckCircle className="w-6 h-6" />
              <span>نعم، فهمت تماماً</span>
            </button>
            
            <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleUnderstanding(UnderstandingLevel.PARTIAL)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-slate-700 rounded-xl flex flex-col items-center gap-2 transition-all"
                >
                  <HelpCircle className="w-6 h-6" />
                  <span className="font-bold text-sm">احتاج مراجعة</span>
                </button>
                
                <button 
                  onClick={() => handleUnderstanding(UnderstandingLevel.NOT_UNDERSTOOD)}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-violet-400 border border-slate-700 rounded-xl flex flex-col items-center gap-2 transition-all"
                >
                  <Bot className="w-6 h-6" />
                  <span className="font-bold text-sm">لخصه لي (AI)</span>
                </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 animate-fade-in">
             <button 
               onClick={() => onComplete(understanding)}
               className="flex items-center gap-3 px-12 py-4 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-bold text-xl shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1 active:translate-y-0 w-full md:w-auto justify-center"
             >
               <ArrowRight className="w-6 h-6" />
               الاختبار السريع
             </button>
          </div>
        )}

        {/* BOTTOM NAVIGATION FOOTER - WITH PREV/NEXT BUTTONS */}
        <div className="mt-8 pt-6 border-t border-slate-800/50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
                
                {/* Previous Button - Always visible if hasPrev */}
                <div className="w-full md:w-auto order-2 md:order-1">
                  {hasPrev && onPrev ? (
                      <button 
                          onClick={onPrev}
                          className="w-full md:w-auto group flex items-center justify-center gap-2 px-6 py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700/50 hover:border-slate-600"
                      >
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          <span className="font-bold">الدرس السابق</span>
                      </button>
                  ) : <div className="hidden md:block w-[140px]" />} 
                </div>

                {/* Next Button */}
                <div className="w-full md:w-auto order-1 md:order-2">
                  {hasNext && onNext && (
                      <button 
                          onClick={onNext}
                          className="w-full md:w-auto group flex items-center justify-center gap-2 px-8 py-3 bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl transition-all border border-slate-700/50 hover:border-emerald-500/30"
                      >
                          <span className="font-bold">الانتقال للدرس التالي</span>
                          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </button>
                  )}
                </div>
            </div>
            
            {hasNext && onNext && understanding === UnderstandingLevel.NOT_SET && (
               <p className="text-[10px] text-slate-600 text-center mt-3">لن يتم احتساب نقاط هذا الدرس إذا انتقلت دون إكماله.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default LessonReader;
