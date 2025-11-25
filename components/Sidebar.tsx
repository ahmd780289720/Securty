

import React from 'react';
import { Shield, LayoutDashboard, BookOpen, Swords, Award, Bot, Cpu, Settings, Terminal } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
  onInstallClick: () => void;
  isStandalone: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'curriculum', label: 'المناهج', icon: BookOpen },
    { id: 'kali_course', label: 'كالي لينكس', icon: Terminal }, // New Item
    { id: 'practice', label: 'التحدي', icon: Swords },
    { id: 'tutor', label: 'المساعد', icon: Cpu },
    { id: 'admin', label: 'التحكم', icon: Settings },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="hidden md:flex flex-col flex-shrink-0 h-full w-64 bg-slate-950 border-l border-slate-800 text-slate-100 z-50 shadow-xl font-cairo transition-all duration-300 relative">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 justify-start pt-safe-top">
          <Shield className="w-8 h-8 text-emerald-500" />
          <span className="text-xl font-bold tracking-wider text-emerald-400">سايبر كويست</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isKali = item.id === 'kali_course';
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center justify-start gap-4 p-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/5' 
                    : 'hover:bg-slate-900 text-slate-400 hover:text-slate-100'
                } ${isKali ? 'mt-4 border-t border-slate-800 pt-4' : ''}`}
              >
                <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-emerald-400 stroke-[2.5px]' : 'group-hover:text-slate-100 stroke-2'}`} />
                <span className="font-bold">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-3 pb-safe-bottom">
          <div className="bg-slate-900 rounded-lg p-3 text-center border border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-bold mb-1">حالة السيرفر</p>
            <p className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-2">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
               متصل بالشبكة
            </p>
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
      <div className="md:hidden flex-none bg-slate-950 border-t border-slate-800 text-slate-100 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] font-cairo pb-safe-bottom">
        <nav className="flex items-center justify-around h-20 px-2 overflow-x-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`flex flex-col items-center justify-center min-w-[60px] h-full space-y-1.5 transition-colors duration-200 ${
                  isActive 
                    ? 'text-emerald-400' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <div className={`p-2 rounded-full transition-all ${isActive ? 'bg-emerald-500/10 scale-110' : ''}`}>
                   <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </div>
                <span className="text-[10px] font-bold tracking-wide whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;