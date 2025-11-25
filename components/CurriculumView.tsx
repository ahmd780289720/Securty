
import React, { useEffect, useRef } from 'react';
import { Level } from '../types';
import { Lock, Play, Book, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

interface CurriculumViewProps {
  levels: Level[];
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
  // New props for controlled state
  expandedCourseId: string | null;
  onToggleCourse: (courseId: string | null) => void;
}

const CurriculumView: React.FC<CurriculumViewProps> = ({ 
  levels, 
  onSelectLesson, 
  onBack,
  expandedCourseId,
  onToggleCourse
}) => {
  
  // خاصية التمرير التلقائي للوحدة المفتوحة عند العودة
  useEffect(() => {
    if (expandedCourseId) {
      // نستخدم Timeout بسيط لضمان أن الصفحة قد تم رسمها قبل التمرير
      const timer = setTimeout(() => {
        const element = document.getElementById(`course-${expandedCourseId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }, 150); 
      return () => clearTimeout(timer);
    }
  }, [expandedCourseId]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-cairo animate-fade-in pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6 sticky top-0 bg-slate-950/90 backdrop-blur-md p-4 z-20 border-b border-slate-800 rounded-b-2xl shadow-lg">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        <div>
           <h2 className="text-xl md:text-3xl font-bold text-white">خريطة العمليات</h2>
           <p className="text-slate-400 text-xs md:text-sm">اختر هدفك التالي بعناية.</p>
        </div>
      </div>

      {levels.map((level, levelIndex) => (
        <div key={level.id} className={`relative pr-4 md:pr-8 pb-10 border-r-2 ${levelIndex === levels.length - 1 ? 'border-transparent' : 'border-slate-800'}`}>
          {/* Timeline Node */}
          <div className={`absolute -right-[17px] md:-right-[21px] top-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 z-10 bg-slate-950 ${
            level.isLocked ? 'border-slate-700' : 'border-emerald-500'
          }`}>
            <span className={`font-bold text-sm md:text-base ${level.isLocked ? 'text-slate-500' : 'text-emerald-400'}`}>
              {level.id}
            </span>
          </div>

          <div className="mb-6 mr-2 md:mr-4 pt-1">
            <h3 className={`text-lg md:text-xl font-bold ${level.isLocked ? 'text-slate-500' : 'text-white'}`}>
              {level.title}
            </h3>
            <p className="text-slate-500 text-xs md:text-sm">{level.description}</p>
          </div>

          <div className="grid gap-4 mr-2 md:mr-4">
            {level.courses.map((course) => (
              <div 
                key={course.id} 
                id={`course-${course.id}`} /* ID مهم لعملية الـ Scroll */
                className={`bg-slate-900 border ${
                  expandedCourseId === course.id 
                    ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' 
                    : level.isLocked || course.isLocked ? 'border-slate-800 opacity-60' : 'border-slate-700 hover:border-slate-600'
                } rounded-xl overflow-hidden transition-all duration-300`}
              >
                
                <button 
                  onClick={() => !level.isLocked && !course.isLocked && onToggleCourse(expandedCourseId === course.id ? null : course.id)}
                  className="w-full p-4 md:p-5 flex items-center justify-between text-right"
                  disabled={level.isLocked || course.isLocked}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      course.isLocked || level.isLocked 
                        ? 'bg-slate-800 text-slate-600' 
                        : expandedCourseId === course.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-800 text-emerald-500'
                    }`}>
                      {course.isLocked || level.isLocked ? <Lock className="w-6 h-6" /> : <Book className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className={`font-bold text-sm md:text-base ${course.isLocked || level.isLocked ? 'text-slate-500' : 'text-slate-200'}`}>
                        {course.title}
                      </h4>
                      {!course.isLocked && !level.isLocked && (
                        <p className="text-[10px] md:text-xs text-slate-500 mt-1 line-clamp-1">{course.description}</p>
                      )}
                    </div>
                  </div>
                  {!(level.isLocked || course.isLocked) && (
                     <div className={`transition-transform duration-300 ${expandedCourseId === course.id ? 'rotate-180' : ''}`}>
                       <ChevronDown className={`w-5 h-5 ${expandedCourseId === course.id ? 'text-emerald-500' : 'text-slate-500'}`} />
                     </div>
                  )}
                </button>

                {/* Modules Expansion */}
                {expandedCourseId === course.id && (
                  <div className="bg-black/20 border-t border-slate-800/50 p-2 md:p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {course.modules.length === 0 && <p className="text-slate-500 text-center text-sm">لا توجد وحدات متاحة حالياً.</p>}
                    
                    {course.modules.map(module => (
                      <div key={module.id} className="space-y-2">
                        <div className="space-y-1">
                          {module.lessons.map((lesson, idx) => (
                            <button 
                              key={lesson.id}
                              onClick={() => onSelectLesson(lesson.id)}
                              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 active:bg-slate-700 transition-colors group border border-transparent hover:border-slate-700"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-slate-600 font-mono text-xs font-bold w-4">{idx + 1}</span>
                                <span className="text-slate-300 group-hover:text-white font-medium text-xs md:text-sm text-right line-clamp-1">
                                  {lesson.title.split('(')[0]} {/* Show mainly Arabic title */}
                                </span>
                              </div>
                              <div className="shrink-0 flex items-center gap-2 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-3 h-3 fill-current" />
                                <span>بدء</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CurriculumView;
