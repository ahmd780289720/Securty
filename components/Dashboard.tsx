
import React from 'react';
import { UserState } from '../types';
import { Flame, Heart, Star, Target, Clock, Zap, Swords } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface DashboardProps {
  userState: UserState;
  onStartChallenge: () => void;
  onInstallClick: () => void;
  isStandalone: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ userState, onStartChallenge }) => {
  // Use real data from userState
  const chartData = userState.weeklyProgress.map(p => ({
      name: p.day,
      xp: p.xp
  }));

  return (
    <div className="space-y-8 animate-fade-in font-cairo">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-5 flex items-center justify-between shadow-lg">
           <div>
               <h3 className="font-bold text-white text-lg">أهلاً بك في القاعدة</h3>
               <p className="text-slate-400 text-sm">نظام المحاكاة يعمل بكفاءة. ابدأ تدريباتك اليوم.</p>
           </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-xl">
            <Flame className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">حماس يومي</p>
            <p className="text-2xl font-bold text-white">{userState.streak} أيام</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-yellow-500/20 rounded-xl">
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">نقاط الخبرة</p>
            <p className="text-2xl font-bold text-white">{userState.xp}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl">
            <Heart className={`w-6 h-6 text-rose-500 ${userState.hearts < 5 ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">الطاقة</p>
            <p className="text-2xl font-bold text-white">{userState.hearts}/5</p>
            {userState.hearts < 5 && <p className="text-[10px] text-emerald-400 mt-1">تجديد: +1 كل 5د</p>}
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Target className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-bold">الدروس المكتملة</p>
            <p className="text-2xl font-bold text-white">{userState.completedLessons.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress Chart (Dynamic) */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700 rounded-3xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">النشاط الأكاديمي (الواقعي)</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-300">آخر 7 أيام</span>
            </div>
          </div>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', direction: 'rtl' }}
                  itemStyle={{ color: '#10b981' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="xp" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#10b981'}} 
                    activeDot={{r: 6}} 
                    isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 left-0 p-4 opacity-10">
            <Zap className="w-32 h-32 text-emerald-400" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 relative z-10">التحدي اليومي</h3>
          <p className="text-emerald-200/70 text-sm mb-6 relative z-10">
             اجمع XP وراجع معلوماتك السابقة لضمان عدم نسيانها.
          </p>

          <button 
            onClick={onStartChallenge}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 relative z-10 flex justify-center items-center gap-2"
          >
            <Swords className="w-5 h-5" />
            الذهاب للساحة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
