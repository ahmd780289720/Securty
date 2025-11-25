
import React, { useState, useEffect, useRef } from 'react';
import { UserState, Lesson, Question, QuestionType } from '../types';
import { Terminal, Swords, Play, Lock, Zap, ArrowRight, Laptop } from 'lucide-react';

interface PracticeArenaProps {
  userState: UserState;
  allLessons: Record<string, Lesson>;
  onStartQuiz: (questions: Question[]) => void;
  onBack?: () => void;
}

// Fallback questions for new users
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: "fb-1",
    type: QuestionType.MCQ,
    text: "ما هو الهدف الرئيسي من مثلث CIA في أمن المعلومات؟",
    options: ["وكالة الاستخبارات المركزية", "السرية، النزاهة، التوافر", "التحكم في الوصول للإنترنت", "تشفير البيانات فقط"],
    correctAnswerIndex: 1,
    explanation: "CIA Triad (Confidentiality, Integrity, Availability) هو النموذج الأساسي لأمن المعلومات."
  },
  {
    id: "fb-2",
    type: QuestionType.MCQ,
    text: "أي مما يلي يعتبر كلمة مرور قوية؟",
    options: ["password123", "admin", "P@$$w0rd_2025_Sec!", "12345678"],
    correctAnswerIndex: 2,
    explanation: "كلمات المرور القوية تحتوي حروفاً كبيرة وصغيرة وأرقاماً ورموزاً."
  },
  {
    id: "fb-3",
    type: QuestionType.MCQ,
    text: "ما هو Phishing؟",
    options: ["صيد الأسماك", "نوع من الفيروسات", "محاولة خداع المستخدم لكشف معلومات حساسة", "برنامج حماية"],
    correctAnswerIndex: 2,
    explanation: "التصيد (Phishing) هو هندسة اجتماعية لسرقة البيانات."
  }
];

// --- MOCK FILE SYSTEM FOR SIMULATOR ---
const MOCK_FILES: Record<string, string[]> = {
  '~': ['Desktop', 'Downloads', 'Documents', 'tools', 'flag.txt'],
  '~/Desktop': ['user_creds.txt', 'screenshot.png'],
  '~/Downloads': ['payload.exe', 'installer.sh'],
  '~/Documents': ['notes.txt', 'report.pdf'],
  '~/tools': ['nmap', 'metasploit', 'hydra', 'wireshark'],
};

const FILE_CONTENTS: Record<string, string> = {
  '~/flag.txt': 'CTF{W3lc0m3_T0_Cybe3rQu3st_R00t}',
  '~/Desktop/user_creds.txt': 'admin:SuperSecretPass123',
  '~/Documents/notes.txt': 'Reminder: Update the firewall rules tonight.',
  '~/Downloads/installer.sh': '#!/bin/bash\necho "Installing malware..."',
};

const PracticeArena: React.FC<PracticeArenaProps> = ({ userState, allLessons, onStartQuiz, onBack }) => {
  const [activeTab, setActiveTab] = useState<'sim' | 'challenges'>('challenges');
  
  // --- Terminal Simulation State ---
  const [history, setHistory] = useState<string[]>([
    "Kali GNU/Linux Rolling [Version 2025.1]",
    "Type 'help' for available commands.",
    "---------------------------------------"
  ]);
  const [command, setCommand] = useState('');
  const [currentPath, setCurrentPath] = useState('~');
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll when history updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);
  
  // Force focus whenever sim is active
  useEffect(() => {
    if (activeTab === 'sim') {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }
  }, [activeTab]);

  const processCommand = (cmdInput: string) => {
    // Basic sanitization
    const trimmedInput = cmdInput.trim();
    if (!trimmedInput) return [];

    const parts = trimmedInput.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    let output: string[] = [];

    switch (cmd) {
      case 'help':
        output = [
          "GNU bash, version 5.1.16(1)-release",
          "Available Commands:",
          "  ls        List directory contents",
          "  cd        Change directory",
          "  pwd       Print working directory",
          "  cat       Concatenate and display files",
          "  clear     Clear the terminal screen",
          "  whoami    Print effective userid",
          "  sudo      Execute a command as another user",
          "  date      Print system date and time",
          "  ping      Send ICMP ECHO_REQUEST (simulated)",
          "  ifconfig  Configure a network interface (simulated)",
          "  nmap      Network exploration tool (simulated)",
          "  exit      Close the terminal"
        ];
        break;

      case 'ls':
        const files = MOCK_FILES[currentPath] || [];
        output = [files.join('  ')];
        break;

      case 'pwd':
        output = [`/root/${currentPath.replace('~', '')}`.replace('//', '/')];
        break;

      case 'whoami':
        output = ["root"];
        break;
      
      case 'sudo':
        if (args.length === 0) {
            output = ["usage: sudo -h | -K | -k | -V"];
        } else if (args[0] === 'su') {
            output = ["Already root."];
        } else {
            output = ["root is already the highest privilege."];
        }
        break;

      case 'date':
        output = [new Date().toString()];
        break;

      case 'ping':
         if (args.length === 0) {
             output = ["usage: ping [destination]"];
         } else {
             output = [
                 `PING ${args[0]} (127.0.0.1) 56(84) bytes of data.`,
                 `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.045 ms`,
                 `64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms`,
                 `64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.042 ms`,
                 `--- ${args[0]} ping statistics ---`,
                 `3 packets transmitted, 3 received, 0% packet loss`
             ];
         }
         break;

      case 'cd':
        if (args.length === 0 || args[0] === '~') {
          setCurrentPath('~');
        } else if (args[0] === '..') {
          if (currentPath !== '~') {
            // Simple logic to go back one level
            if (currentPath.includes('/')) {
                setCurrentPath(currentPath.substring(0, currentPath.lastIndexOf('/')) || '~');
            } else {
                setCurrentPath('~');
            }
          }
        } else {
          const targetDir = args[0].replace(/\/$/, '');
          const potentialPath = currentPath === '~' ? `~/${targetDir}` : `${currentPath}/${targetDir}`;
          
          if (MOCK_FILES[potentialPath]) {
            setCurrentPath(potentialPath);
          } else {
            output = [`bash: cd: ${args[0]}: No such file or directory`];
          }
        }
        break;

      case 'cat':
        if (args.length === 0) {
          output = ["usage: cat [file]"];
        } else {
          const fileName = args[0];
          const fullPath = currentPath === '~' ? `~/${fileName}` : `${currentPath}/${fileName}`;
          
          if (FILE_CONTENTS[fullPath]) {
            output = [FILE_CONTENTS[fullPath]];
          } else if (MOCK_FILES[currentPath]?.includes(fileName)) {
             output = [`cat: ${fileName}: Is a directory`]; 
          } else {
            output = [`cat: ${fileName}: No such file or directory`];
          }
        }
        break;

      case 'ifconfig':
        output = [
          "eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500",
          "        inet 192.168.1.105  netmask 255.255.255.0",
          "        ether 00:0c:29:6b:8e:d1  txqueuelen 1000  (Ethernet)",
          "lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536",
          "        inet 127.0.0.1  netmask 255.0.0.0"
        ];
        break;

      case 'nmap':
        if (args.length === 0) {
           output = [
             "Nmap 7.94 ( https://nmap.org )",
             "Usage: nmap [target]",
           ];
        } else {
           output = [
             `Starting Nmap 7.94 at ${new Date().toLocaleTimeString()}`,
             `Nmap scan report for ${args[0]}`,
             "Host is up (0.0012s latency).",
             "Not shown: 997 closed ports",
             "PORT     STATE SERVICE",
             "22/tcp   open  ssh",
             "80/tcp   open  http",
             "443/tcp  open  https",
             "",
             "Nmap done: 1 IP address scanned in 1.45 seconds"
           ];
        }
        break;

      case 'clear':
        setHistory([]);
        return []; 

      case 'exit':
        setActiveTab('challenges');
        return [];

      default:
        output = [`bash: ${cmd}: command not found`];
    }
    return output;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if(e.key === 'Enter') {
          const cmdInput = command;
          
          // Add User Command line to history
          const prompt = `root@kali:${currentPath.replace('~', '~')}#`;
          setHistory(prev => [...prev, `${prompt} ${cmdInput}`]);
          
          // Process output
          const outputLines = processCommand(cmdInput);
          if (outputLines) {
            setHistory(prev => [...prev, ...outputLines]);
          }

          setCommand('');
      }
  };

  const startDailyChallenge = () => {
    // 1. Collect all possible questions from completed lessons
    const completedLessonIds = userState.completedLessons;
    let poolOfQuestions: Question[] = [];

    // Add questions from completed lessons
    Object.values(allLessons).forEach((lesson: Lesson) => {
        if (completedLessonIds.includes(lesson.id) && lesson.questions) {
            poolOfQuestions = [...poolOfQuestions, ...lesson.questions];
        }
    });

    // 2. Determine Quiz Set
    let finalQuizQuestions: Question[] = [];
    
    if (poolOfQuestions.length >= 3) {
       // Randomly pick 5 questions from the pool
       finalQuizQuestions = poolOfQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
       // If not enough completed lessons, use the Placement Test / Fallback
       finalQuizQuestions = FALLBACK_QUESTIONS;
    }
    
    // 3. Start Quiz
    if (finalQuizQuestions.length > 0) {
      onStartQuiz(finalQuizQuestions);
    } else {
      alert("جاري تجهيز التحديات... يرجى إكمال درس واحد على الأقل.");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 font-cairo">
      {/* Header Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full md:w-fit mx-auto shrink-0 shadow-lg">
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'challenges' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Swords className="w-4 h-4" />
          حلبة التحدي
        </button>
        <button
          onClick={() => setActiveTab('sim')}
          className={`flex-1 md:flex-none px-6 py-2 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'sim' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4" />
          نظام كالي (Kali)
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* --- Challenges Tab --- */}
        {activeTab === 'challenges' && (
          <div className="h-full overflow-y-auto p-1 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Card */}
                <div className="bg-gradient-to-br from-emerald-900/50 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap className="w-32 h-32 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">التحدي اليومي</h3>
                  <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                    {userState.completedLessons.length > 0 
                       ? `مراجعة ${userState.completedLessons.length} درس سابق لترسيخ المعلومات.`
                       : `اختبار تحديد مستوى سريع للدخول في الجو.`
                    }
                  </p>
                  
                  <button 
                      onClick={startDailyChallenge}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                  >
                      <Play className="w-5 h-5" />
                      {userState.completedLessons.length > 0 ? "بدء المراجعة اليومية" : "بدء اختبار تحديد المستوى"}
                  </button>
                </div>

                {/* CTF Card (Locked) */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden opacity-75">
                  <div className="absolute top-4 left-4 text-slate-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-400 mb-2">مسابقة CTF المصغرة</h3>
                  <p className="text-slate-500 mb-6">
                    تحديات عملية (Flags) تتطلب استخدام التيرمنال. (تفتح عند المستوى 3).
                  </p>
                  <button disabled className="w-full py-3 bg-slate-800 text-slate-500 font-bold rounded-xl cursor-not-allowed border border-slate-700">
                    مغلق حالياً
                  </button>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white mb-1">حالتك الحالية</h4>
                <p className="text-emerald-400 text-sm">Level {userState.level} Operator</p>
              </div>
              <div className="text-right">
                 <p className="text-xs text-slate-400 mb-1">الدروس المنجزة</p>
                 <p className="text-2xl font-bold text-white font-mono">{userState.completedLessons.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- Simulation Tab (Interactive Kali) --- */}
        {activeTab === 'sim' && (
          <div 
             className="h-full flex flex-col bg-[#0d0d0d] rounded-xl border border-slate-700 overflow-hidden shadow-2xl font-mono text-sm md:text-base animate-fade-in absolute inset-0 z-10" 
             dir="ltr"
             onClick={() => inputRef.current?.focus()} /* Clicking anywhere focuses input */
          >
            {/* Terminal Header */}
            <div className="bg-[#1f1f1f] p-2 flex items-center justify-between border-b border-[#333] shrink-0">
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                 <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold opacity-70">
                <Laptop className="w-3 h-3" />
                <span>kali-linux-rolling — bash — 80x24</span>
              </div>
              <div className="w-8"></div>
            </div>
            
            {/* Terminal Body */}
            <div 
              className="flex-1 p-4 text-left overflow-y-auto cursor-text scrollbar-hide" 
              style={{ fontFamily: "'Fira Code', 'Courier New', monospace" }}
            >
                 {history.map((line, idx) => (
                   <div key={idx} className={`${line.startsWith('root@kali') ? 'mt-2' : 'text-slate-300'} break-words whitespace-pre-wrap`}>
                     {line.startsWith('root@kali') ? (
                       <span>
                         <span className="text-emerald-500 font-bold">root@kali</span>
                         <span className="text-white">:</span>
                         <span className="text-blue-500 font-bold">{line.split('#')[0].split(':')[1] || '~'}</span>
                         <span className="text-white"># </span>
                         <span className="text-white">{line.split('#')[1]}</span>
                       </span>
                     ) : (
                       line
                     )}
                   </div>
                 ))}
                 
                 {/* Input Line - Completely Transparent but Typable */}
                 <div className="flex items-center mt-2 relative">
                    <span className="text-emerald-500 font-bold shrink-0">root@kali</span>
                    <span className="text-white">:</span>
                    <span className="text-blue-500 font-bold shrink-0">{currentPath}</span>
                    <span className="text-white mr-2">#</span>
                    
                    <div className="flex-1 relative min-h-[20px]">
                        {/* Hidden Input Layer - Ensure it has size but is invisible */}
                        <input 
                          ref={inputRef}
                          type="text" 
                          value={command}
                          onChange={(e) => setCommand(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-20 text-base"
                          autoComplete="off"
                          autoFocus
                          autoCapitalize="none"
                          spellCheck={false}
                        />
                        {/* Visible Text Layer */}
                        <div className="text-white whitespace-pre font-mono flex items-center pointer-events-none absolute inset-0 z-10">
                            {command}
                            {/* Blinking Cursor */}
                            <span className="w-2 h-5 bg-slate-400 animate-pulse ml-0.5 inline-block align-middle shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                        </div>
                    </div>
                 </div>
                 <div ref={terminalEndRef} />
            </div>
          </div>
        )}

      </div>
       
      {/* Bottom Back Button */}
       <div className="pt-2 flex justify-center border-t border-slate-800/50">
          <button 
            onClick={() => {
                if (onBack) onBack();
                else window.dispatchEvent(new CustomEvent('navigate-back'));
            }}
            className="flex items-center gap-2 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors text-sm font-bold"
          >
            <ArrowRight className="w-4 h-4" />
            الرجوع للقائمة الرئيسية
          </button>
       </div>
    </div>
  );
};

export default PracticeArena;
