

import React, { useState, useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import type { PluginListenerHandle } from '@capacitor/core';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CurriculumView from './components/CurriculumView';
import LessonReader from './components/LessonReader';
import QuizGame from './components/QuizGame';
import ChatTutor from './components/ChatTutor';
import PracticeArena from './components/PracticeArena';
import ControlPanel from './components/ControlPanel';
import KaliCourseView from './components/KaliCourseView'; // Import New View
import { INITIAL_USER_STATE, LEVELS_DATA, KALI_CURRICULUM } from './constants';
import { Level, Lesson, UnderstandingLevel, Question, UserState } from './types';

// Flatten lessons for easy lookup
const getAllLessons = (levels: Level[]) => {
  const lessons: Record<string, Lesson> = {};
  
  // Add Standard Curriculum
  levels.forEach(l => l.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(les => {
    lessons[les.id] = les;
  }))));

  // Add Kali Curriculum
  KALI_CURRICULUM.modules.forEach(m => m.lessons.forEach(les => {
    lessons[les.id] = les;
  }));

  return lessons;
};

// Helper to get ordered list of lesson IDs
const getLessonOrder = (levels: Level[]) => {
  const ids: string[] = [];
  levels.forEach(l => l.courses.forEach(c => c.modules.forEach(m => m.lessons.forEach(les => {
    ids.push(les.id);
  }))));
  
  // NOTE: Kali lessons are not part of the main "Next/Prev" linear flow of the main curriculum
  // unless we explicitly want them to be. For now, they are independent.
  return ids;
};

// STORAGE KEY
const STATE_KEY = 'cyberquest_user_state_v2';

const App: React.FC = () => {
  // We separate the "View" state from the "Data" state to manage navigation cleanly
  const [currentView, _setCurrentView] = useState('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<'none' | 'quiz'>('none');
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<Question[]>([]);
  
  // State to track which course is expanded in the curriculum view
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);
  
  // Refs for State (Critical for Event Listeners)
  const stateRef = useRef({ view: 'dashboard', mode: 'none' });
  
  // Update refs whenever state changes
  useEffect(() => {
    stateRef.current = { view: currentView, mode: gameMode };
  }, [currentView, gameMode]);

  // Initialize state from LocalStorage or Default
  const [userState, setUserState] = useState<UserState>(() => {
    const saved = localStorage.getItem(STATE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_USER_STATE, ...parsed };
      } catch (e) {
        console.error("Error loading state", e);
        return INITIAL_USER_STATE;
      }
    }
    return INITIAL_USER_STATE;
  });

  const levelsData = LEVELS_DATA;
  const allLessons = getAllLessons(levelsData);
  const lessonOrder = getLessonOrder(levelsData);
  const isStandalone = true; 

  // --- Persistence Effect ---
  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(userState));
  }, [userState]);

  // --- NAVIGATION SYSTEM START ---
  
  // 1. Initialize History on Mount
  useEffect(() => {
    // Replace current state with dashboard to ensure we have a base state
    window.history.replaceState({ view: 'dashboard', mode: 'none' }, '');
  }, []);

  // 2. The Core Navigation Function (Call this instead of setCurrentView directly)
  const handleNavigate = (newView: string, newMode: 'none' | 'quiz' = 'none') => {
    // Only push state if we are actually changing something meaningful
    if (newView !== currentView || newMode !== gameMode) {
      const newState = { view: newView, mode: newMode };
      window.history.pushState(newState, '');
      _setCurrentView(newView);
      setGameMode(newMode);
    }
  };

  // 3. Handle Browser/Hardware Back Button (PopState)
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      // If event.state exists, we restore that state
      if (event.state) {
        const { view, mode } = event.state;
        _setCurrentView(view || 'dashboard');
        setGameMode(mode || 'none');
        
        // Clear active lesson if we left lesson view
        if (view !== 'lesson') {
          setActiveLessonId(null);
        }
      } else {
        // Fallback if state is null (e.g. initial load), go to dashboard
        _setCurrentView('dashboard');
        setGameMode('none');
      }
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // 4. Capacitor Hardware Back Button Handler
// 4. Capacitor Hardware Back Button Handler
useEffect(() => {
  let backHandler: PluginListenerHandle | null = null;

  const onBack = (ev: any) => {
    if (ev && ev.detail && typeof ev.detail.register === 'function') {
      ev.detail.register();
    }

    const { view, mode } = stateRef.current;

    if (view === 'dashboard' && mode === 'none') {
      const confirmExit = window.confirm('هل تريد الخروج من التطبيق؟');
      if (confirmExit) {
        CapacitorApp.exitApp();
      }
    } else {
      window.history.back();
    }
  };

  const registerListener = async () => {
    await CapacitorApp.removeAllListeners();
    backHandler = await CapacitorApp.addListener('backButton', onBack);
  };

  registerListener();

  return () => {
    if (backHandler) {
      backHandler.remove();
    }
  };
}, []); //Empty dependency array = stable listener

  // --- NAVIGATION SYSTEM END ---

  // --- UI Handlers ---

  const handleUIBack = () => {
    window.history.back();
  };

  const handleSelectLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    handleNavigate('lesson');
  };

  const handleStartPracticeQuiz = (questions: Question[]) => {
    if (questions && questions.length > 0) {
      setActiveQuizQuestions(questions);
      handleNavigate(currentView, 'quiz');
    } else {
      alert("لا توجد أسئلة متاحة حالياً.");
    }
  };

  const handleLessonComplete = (understanding: UnderstandingLevel) => {
    setUserState(prev => {
        const newWeekly = [...prev.weeklyProgress];
        newWeekly[6].xp += 50; 

        return {
            ...prev,
            xp: prev.xp + 50, 
            completedLessons: Array.from(new Set([...prev.completedLessons, activeLessonId || ''])),
            weeklyProgress: newWeekly
        };
    });
    
    if (activeLessonId && allLessons[activeLessonId]) {
      const lesson = allLessons[activeLessonId];
      if (lesson.questions && lesson.questions.length > 0) {
        setActiveQuizQuestions(lesson.questions);
        // Replace current lesson in history with quiz, or push quiz
        // Pushing is safer so Back returns to Lesson
        handleNavigate('lesson', 'quiz');
      } else {
        window.history.back();
      }
    } else {
      window.history.back();
    }
  };

  const handleQuizComplete = (score: number) => {
      setUserState(prev => {
         const newWeekly = [...prev.weeklyProgress];
         newWeekly[6].xp += score;
         return { ...prev, xp: prev.xp + score, weeklyProgress: newWeekly };
      });
      // Simple back step to exit quiz mode
      window.history.back();
  };

  const handleQuizExit = () => {
      window.history.back();
  };

  // --- Heart Regeneration Logic ---
  useEffect(() => {
    const checkHearts = () => {
      setUserState(prev => {
        if (prev.hearts >= 5) return prev; // Full hearts

        const now = Date.now();
        const msPassed = now - prev.lastHeartRegen;
        const minutesPassed = Math.floor(msPassed / (5 * 60 * 1000)); // 5 minutes

        if (minutesPassed > 0) {
          const newHearts = Math.min(5, prev.hearts + minutesPassed);
          return {
            ...prev,
            hearts: newHearts,
            lastHeartRegen: now
          };
        }
        return prev;
      });
    };

    checkHearts();
    const interval = setInterval(checkHearts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleResetProgress = () => {
    if(confirm("سيتم حذف جميع بياناتك والبدء من الصفر. هل أنت متأكد؟")) {
      setUserState(INITIAL_USER_STATE);
      localStorage.removeItem(STATE_KEY);
      window.location.reload();
    }
  };

  const handleUnlockAll = () => {
    alert("تم إيقاف هذه الميزة لضمان التدرج التعليمي الصحيح.");
  };

  const handleNextLesson = () => {
    if (activeLessonId) {
      // Check if it's a standard lesson
      const currentIndex = lessonOrder.indexOf(activeLessonId);
      if (currentIndex !== -1 && currentIndex < lessonOrder.length - 1) {
        const nextId = lessonOrder[currentIndex + 1];
        setActiveLessonId(nextId);
        window.history.pushState({ view: 'lesson', mode: 'none' }, '');
      } else {
        // Fallback for independent lessons (like Kali)
        alert("أتممت هذا الدرس! عد للقائمة لاختيار الدرس التالي.");
        window.history.back();
      }
    }
  };

  const handlePrevLesson = () => {
    window.history.back();
  };

  const renderView = () => {
    if (gameMode === 'quiz') {
      return <QuizGame 
        questions={activeQuizQuestions || []} 
        onComplete={handleQuizComplete} 
        onExit={handleQuizExit} 
        deductHeart={() => {
            setUserState(prev => ({
                ...prev,
                hearts: Math.max(0, prev.hearts - 1),
                lastHeartRegen: prev.hearts === 5 ? Date.now() : prev.lastHeartRegen
            }));
        }}
        currentHearts={userState.hearts}
      />;
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard userState={userState} onStartChallenge={() => handleNavigate('practice')} onInstallClick={() => {}} isStandalone={isStandalone} />;
      case 'curriculum':
        return (
          <CurriculumView 
            levels={levelsData} 
            onSelectLesson={handleSelectLesson} 
            onBack={handleUIBack}
            expandedCourseId={expandedCourseId}
            onToggleCourse={setExpandedCourseId}
          />
        );
      case 'kali_course': // New Case
        return (
          <KaliCourseView 
             course={KALI_CURRICULUM}
             onSelectLesson={handleSelectLesson}
             onBack={handleUIBack}
          />
        );
      case 'tutor':
        return <ChatTutor onBack={handleUIBack} />;
      case 'practice': 
        return <PracticeArena userState={userState} allLessons={allLessons} onStartQuiz={handleStartPracticeQuiz} onBack={handleUIBack} />;
      case 'admin': 
        return <ControlPanel userState={userState} onResetProgress={handleResetProgress} onUnlockAll={handleUnlockAll} onBack={handleUIBack} />;
      case 'lesson':
        if (!activeLessonId || !allLessons[activeLessonId]) return <div className="text-white p-10 font-cairo text-center">جاري التحميل...</div>;
        
        const currentIndex = lessonOrder.indexOf(activeLessonId);
        const hasNext = currentIndex !== -1 && currentIndex < lessonOrder.length - 1;
        const hasPrev = currentIndex > 0;

        return (
          <LessonReader 
            lesson={allLessons[activeLessonId]} 
            onComplete={handleLessonComplete} 
            onBack={handleUIBack}
            onNext={handleNextLesson}
            hasNext={hasNext}
            onPrev={handlePrevLesson} 
            hasPrev={hasPrev}         
          />
        );
      default:
        return <Dashboard userState={userState} onStartChallenge={() => {}} onInstallClick={() => {}} isStandalone={isStandalone} />;
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-screen bg-slate-950 overflow-hidden font-cairo text-slate-100 select-none" dir="rtl">
      
      <Sidebar 
        currentView={currentView} 
        setView={(view) => handleNavigate(view)} 
        onInstallClick={() => {}} 
        isStandalone={isStandalone} 
      />
      
      <main className="flex-1 h-full overflow-hidden relative bg-slate-950">
        {/* Added pt-safe-top to handle Status Bar / Notch area on phones */}
        <div id="app-scroll-container" className="h-full w-full overflow-y-auto overflow-x-hidden p-3 md:p-6 pt-safe-top">
           {renderView()}
        </div>
      </main>

    </div>
  );
};

export default App;
