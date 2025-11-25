
import React, { useState } from 'react';
import { UserState } from '../types';
import { Shield, Trash2, Unlock, AlertTriangle, CheckCircle, Activity, Server, Database } from 'lucide-react';

interface ControlPanelProps {
  userState: UserState;
  onResetProgress: () => void;
  onUnlockAll: () => void;
  onBack: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ userState, onResetProgress, onUnlockAll, onBack }) => {
  const [confirmReset, setConfirmReset] = useState(false);
  const [logs, setLogs] = useState<string[]>(["System initialized...", "Monitoring active..."]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-5));
  };

  const handleReset = () => {
    if (confirmReset) {
      onResetProgress();
      addLog("SYSTEM WIPE: User progress reset.");
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-4 md:p-8 font-cairo overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
               <Shield className="w-8 h-8 text-red-500" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-white tracking-wider">الإعدادات المتقدمة</h2>
               <p className="text-slate-400 text-sm font-mono">Administration Console</p>
             </div>
          </div>
          <button onClick={onBack} className="px-4 py-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
            إغلاق
          </button>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
              <Activity className="text-emerald-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase">System Status</p>
                <p className="text-white font-bold">ONLINE</p>
              </div>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
              <Database className="text-blue-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase">User XP</p>
                <p className="text-white font-bold">{userState.xp}</p>
              </div>
           </div>
           <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4">
              <Server className="text-purple-500" />
              <div>
                <p className="text-xs text-slate-500 uppercase">Hearts</p>
                <p className="text-white font-bold">{userState.hearts}/5</p>
              </div>
           </div>
        </div>

        {/* Actions Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Danger Zone */}
          <div className="bg-red-950/10 border border-red-900/30 p-6 rounded-2xl">
             <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5" />
               منطقة الخطر
             </h3>
             
             <div className="space-y-4">
               <button 
                 onClick={handleReset}
                 className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                   confirmReset ? 'bg-red-600 text-white animate-pulse' : 'bg-red-900/20 text-red-400 hover:bg-red-900/40 border border-red-900/50'
                 }`}
               >
                 <Trash2 className="w-5 h-5" />
                 {confirmReset ? "هل أنت متأكد؟ اضغط للتأكيد" : "تصفير التقدم بالكامل"}
               </button>
               <p className="text-xs text-red-400/60 mt-2">
                 * سيؤدي هذا إلى حذف جميع الدروس المكتملة والنقاط والعودة للمستوى الأول.
               </p>
             </div>
          </div>
        </div>

        {/* Console Logs */}
        <div className="bg-black rounded-xl p-4 border border-slate-800 font-mono text-sm h-48 overflow-y-auto custom-scrollbar">
           <p className="text-slate-500 mb-2 border-b border-slate-800 pb-1">System Logs:</p>
           {logs.map((log, i) => (
             <p key={i} className="text-emerald-500/80 leading-relaxed">{log}</p>
           ))}
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;
