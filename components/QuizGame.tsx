
import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { Heart, XCircle, CheckCircle, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';
import { explainWrongAnswer } from '../services/geminiService';

interface QuizGameProps {
  questions: Question[];
  onComplete: (score: number) => void;
  onExit: () => void;
  deductHeart: () => void;
  currentHearts: number;
}

interface QueuedQuestion extends Question {
  isRetry?: boolean; // If true, user gets no points but must answer correctly
  tempId: string; // Unique ID for key mapping in list
}

const QuizGame: React.FC<QuizGameProps> = ({ questions, onComplete, onExit, deductHeart, currentHearts }) => {
  // We use a Queue system instead of a simple index
  const [questionQueue, setQuestionQueue] = useState<QueuedQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

  // Initialize Queue
  useEffect(() => {
    if (questions && questions.length > 0) {
      const queue = questions.map(q => ({ ...q, tempId: Math.random().toString(36), isRetry: false }));
      setQuestionQueue(queue);
    }
  }, [questions]);

  // Guard against empty
  if (questionQueue.length === 0) {
    return <div className="text-white text-center p-10 font-cairo">جاري تحميل المعركة...</div>;
  }
  
  if (currentHearts === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in font-cairo">
          <div className="bg-rose-500/20 p-6 rounded-full mb-6 animate-pulse">
            <Heart className="w-16 h-16 text-rose-500" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">نفذت الطاقة!</h2>
          <p className="text-slate-400 mb-8 max-w-md">
            لقد خسرت جميع المحاولات. سيتم إعادة شحن قلب واحد كل 5 دقائق.
            <br/>
            عليك مراجعة الدرس جيداً قبل المحاولة مرة أخرى.
          </p>
          <button 
            onClick={onExit}
            className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
          >
            الانسحاب التكتيكي
          </button>
        </div>
    );
  }

  // Current Question Logic
  // If we finished the queue
  if (currentIndex >= questionQueue.length) {
     return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in font-cairo">
        <div className="bg-emerald-500/20 p-6 rounded-full mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">تم تأمين الهدف!</h2>
        <p className="text-slate-400 mb-8">أتممت التحدي بنجاح.</p>
        <div className="text-3xl font-bold text-emerald-400 mb-8">+{score} XP</div>
        <button 
          onClick={() => onComplete(score)}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          استلام الجائزة
        </button>
      </div>
     );
  }

  const currentQ = questionQueue[currentIndex];
  const progress = ((currentIndex) / questionQueue.length) * 100;

  const handleSubmit = async () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);

    const correct = selectedOption === currentQ.correctAnswerIndex;
    setIsCorrect(correct);

    if (correct) {
      if (!currentQ.isRetry) {
        setScore(s => s + 10);
      }
      // If correct, we just move on when they click "Continue"
    } else {
      // Wrong Answer Logic
      deductHeart(); // Lose a heart immediately
      
      setIsLoadingFeedback(true);
      const explanation = await explainWrongAnswer(
        currentQ.text,
        currentQ.options[selectedOption],
        currentQ.options[currentQ.correctAnswerIndex],
        "Cyber Security"
      );
      setAiFeedback(explanation);
      setIsLoadingFeedback(false);

      // Spaced Repetition: Clone question and insert it later in queue
      // Create a retry version of this question
      const retryQ: QueuedQuestion = {
          ...currentQ,
          tempId: Math.random().toString(36),
          isRetry: true // Mark as retry so no points are given next time
      };

      // Insert it 2 steps ahead, or at end if queue is short
      setQuestionQueue(prev => {
          const newQueue = [...prev];
          let insertIndex = currentIndex + 3; // Skip 2 questions (current + 1 + 2)
          if (insertIndex >= newQueue.length) {
              newQueue.push(retryQ);
          } else {
              newQueue.splice(insertIndex, 0, retryQ);
          }
          return newQueue;
      });
    }
  };

  const handleNext = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
    setAiFeedback(null);
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col font-cairo">
      {/* Top Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onExit} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden" dir="ltr">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center gap-1 text-rose-500 font-bold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          <Heart className={`w-5 h-5 ${currentHearts === 1 ? 'animate-pulse' : ''} fill-current`} />
          <span dir="ltr">{currentHearts}</span>
        </div>
      </div>

      {/* Question Area */}
      <div className="flex-1 flex flex-col justify-center relative">
        {currentQ.isRetry && (
            <div className="absolute top-0 right-0 bg-yellow-500/10 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/30 flex items-center gap-1">
                <RefreshCw className="w-3 h-3" />
                <span>إعادة للتركيز (بدون نقاط)</span>
            </div>
        )}
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center leading-relaxed">
          {currentQ.text}
        </h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let statusClass = "bg-slate-800 border-slate-700 hover:bg-slate-700";
            
            if (isSubmitted) {
              if (idx === currentQ.correctAnswerIndex) {
                statusClass = "bg-emerald-500/20 border-emerald-500 text-emerald-400";
              } else if (idx === selectedOption && !isCorrect) {
                statusClass = "bg-rose-500/20 border-rose-500 text-rose-400";
              } else {
                 statusClass = "bg-slate-800 border-slate-700 opacity-50";
              }
            } else if (selectedOption === idx) {
              statusClass = "bg-blue-500/20 border-blue-500 text-blue-300";
            }

            return (
              <button
                key={idx}
                disabled={isSubmitted}
                onClick={() => setSelectedOption(idx)}
                className={`w-full p-4 rounded-xl border-2 text-right font-medium text-lg transition-all ${statusClass}`}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {isSubmitted && idx === currentQ.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                  {isSubmitted && idx === selectedOption && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer Feedback Area */}
      <div className={`fixed bottom-0 left-0 md:left-0 right-0 md:right-20 p-4 md:p-8 border-t ${
        isSubmitted 
          ? isCorrect 
            ? 'bg-emerald-900/90 border-emerald-500' 
            : 'bg-rose-900/90 border-rose-500' 
          : 'bg-slate-900 border-slate-800'
      } backdrop-blur-lg transition-colors duration-300 z-50`}>
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {!isSubmitted ? (
             <div className="mr-auto w-full md:w-auto text-left">
               <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`w-full md:w-auto px-10 py-3 rounded-xl font-bold text-lg transition-all ${
                  selectedOption !== null 
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                }`}
              >
                تحقق
              </button>
             </div>
          ) : (
            <>
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-2">
                  {isCorrect ? (
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shrink-0">
                      <XCircle className="w-6 h-6 text-rose-600" />
                    </div>
                  )}
                  <div>
                    <span className={`text-xl font-bold block ${isCorrect ? 'text-emerald-100' : 'text-rose-100'}`}>
                        {isCorrect ? 'أحسنت!' : 'إجابة خاطئة'}
                    </span>
                    {!isCorrect && <span className="text-xs text-rose-200">سنكرر هذا السؤال لاحقاً للتأكد من فهمك.</span>}
                  </div>
                </div>
                
                {!isCorrect && (
                  <div className="text-rose-100/90 text-sm mt-2">
                    <span className="font-bold block text-xs uppercase opacity-70 mb-1">الإجابة الصحيحة:</span>
                    <div className="bg-black/30 p-2 rounded mb-2 font-mono text-emerald-300">
                        {currentQ.options[currentQ.correctAnswerIndex]}
                    </div>
                    
                    {aiFeedback && (
                      <div className="mt-3 p-3 bg-black/20 rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 text-white/80 text-xs font-bold mb-1">
                           <Sparkles className="w-3 h-3" /> تحليل المعلم الذكي
                        </div>
                        <p className="text-sm text-white/90 leading-relaxed">{aiFeedback}</p>
                      </div>
                    )}
                    
                    {isLoadingFeedback && !aiFeedback && (
                       <div className="mt-2 text-xs text-white/50 animate-pulse">جاري تحليل الخطأ...</div>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={handleNext}
                className={`w-full md:w-auto px-10 py-3 rounded-xl font-bold text-lg transition-all shrink-0 ${
                  isCorrect 
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white' 
                  : 'bg-rose-500 hover:bg-rose-400 text-white'
                }`}
              >
                استمرار
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizGame;
