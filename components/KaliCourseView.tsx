
import React, { useState } from 'react';
import { Course } from '../types';
import { Terminal, ChevronDown, Play, Command, Hash } from 'lucide-react';

interface KaliCourseViewProps {
  course: Course;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

const KaliCourseView: React.FC<KaliCourseViewProps> = ({ course, onSelectLesson, onBack }) => {
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto font-cairo animate-fade-in pb-20">
      
      {/* Header Styled like a Terminal Banner */}
      <div className="bg-[#0d0d0d] border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
             <div className="p-2 bg-emerald-900/30 rounded border border-emerald-500/30">
               <Terminal className="w-6 h-6 text-emerald-500" />
             </div>
             <h2 className="text-2xl font-bold text-white font-mono tracking-wider">KALI_LINUX_MASTERY</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
            منهج مستقل لإتقان سطر الأوامر (CLI) وأدوات اختبار الاختراق.
            تعلم كيف تتحكم بالنظام كالمحترفين.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {course.modules.map((module, idx) => (
          <div 
            key={module.id} 
            className={`bg-[#0f1115] border ${expandedModuleId === module.id ? 'border-emerald-500/40' : 'border-slate-800'} rounded-xl overflow-hidden transition-all duration-300`}
          >
            <button 
              onClick={() => setExpandedModuleId(expandedModuleId === module.id ? null : module.id)}
              className="w-full p-5 flex items-center justify-between text-right group"
            >
              <div className="flex items-center gap-4">
                 <div className="w-8 h-8 rounded bg-slate-800/50 flex items-center justify-center font-mono text-emerald-500 font-bold border border-slate-700">
                   {idx + 1}
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-lg group-hover:text-emerald-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">{module.description}</p>
                 </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedModuleId === module.id ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>

            {/* Lessons List */}
            {expandedModuleId === module.id && (
              <div className="bg-black/20 border-t border-slate-800/50 p-2 space-y-1">
                {module.lessons.map((lesson) => (
                  <button 
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-900/10 active:bg-emerald-900/20 transition-colors group border border-transparent hover:border-emerald-500/20"
                  >
                    <div className="flex items-center gap-3">
                       <Command className="w-4 h-4 text-slate-600 group-hover:text-emerald-500 transition-colors" />
                       <span className="text-slate-300 font-mono text-sm group-hover:text-white">
                         {lesson.title}
                       </span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1 bg-slate-800 rounded text-[10px] text-emerald-400 font-mono border border-slate-700">
                       <Play className="w-3 h-3 fill-current" />
                       <span>EXECUTE</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KaliCourseView;
