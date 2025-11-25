
import React, { useState, useRef, useEffect } from 'react';
import { askTutor } from '../services/geminiService';
import { Send, Cpu, AlertTriangle, Terminal, ArrowRight, Trash2, Mic, Image as ImageIcon, X } from 'lucide-react';

interface ChatTutorProps {
    onBack: () => void;
}

const CHAT_STORAGE_KEY = 'cybermind_history_v1';

const ChatTutor: React.FC<ChatTutorProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<{id: number, role: 'user' | 'ai', text: string, image?: string}[]>(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
    return [
      { id: Date.now(), role: 'ai', text: "نظام CyberMind v3.0 متصل. جاهز للمساعدة." }
    ];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const longPressTimer = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("المتصفح لا يدعم الصوت.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? ' ' : '') + transcript);
    };
    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = input;
    const userImage = selectedImage;
    
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: userMsg, image: userImage || undefined }]);
    setIsLoading(true);

    const history = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`);
    let rawBase64;
    if (userImage) {
        rawBase64 = userImage.split(',')[1];
    }

    const response = await askTutor(userMsg, history, rawBase64);

    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', text: response }]);
    setIsLoading(false);
  };

  const handleTouchStart = (id: number) => {
    longPressTimer.current = setTimeout(() => {
      setMessageToDelete(id);
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
  };

  const confirmDelete = () => {
    if (messageToDelete) {
      setMessages(prev => prev.filter(m => m.id !== messageToDelete));
      setMessageToDelete(null);
    }
  };

  return (
    // Fixed layout container: H-full prevents page scroll, Flex-col organizes header/body/footer
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-full bg-slate-950 text-slate-100 font-cairo relative rounded-xl overflow-hidden border border-slate-800">
      
      {/* Header - Fixed */}
      <div className="flex-none p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
            <Cpu className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">CYBER MIND <span className="text-[9px] bg-rose-500 text-white px-1 rounded font-mono">V3</span></h3>
          </div>
        </div>
        <div className="text-[10px] text-slate-500">اضغط مطولاً للحذف</div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950 custom-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
                onTouchStart={() => handleTouchStart(msg.id)}
                onTouchEnd={handleTouchEnd}
                onMouseDown={() => handleTouchStart(msg.id)}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                className={`max-w-[85%] p-3 rounded-2xl select-none active:scale-95 transition-transform duration-200 cursor-pointer text-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-br-none' 
                    : 'bg-black text-emerald-400 border border-emerald-900/50 font-mono rounded-bl-none'
                }`}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 mb-1 text-rose-500 text-[9px] font-mono font-bold border-b border-rose-900/30 pb-1">
                  <Terminal className="w-3 h-3" /> system@root
                </div>
              )}
              {msg.image && (
                <img src={msg.image} alt="Upload" className="max-w-full h-auto rounded-lg mb-2 border border-slate-600" />
              )}
              <p className="whitespace-pre-wrap leading-relaxed" dir="auto">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
           <div className="flex justify-start">
             <div className="bg-black p-2 rounded-xl border border-emerald-900 flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
               <span className="text-[9px] text-emerald-500 font-mono animate-pulse">PROCESSING...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed */}
      <div className="flex-none p-2 bg-slate-900 border-t border-slate-800">
        {selectedImage && (
          <div className="flex items-center gap-2 mb-2 p-1.5 bg-slate-800 rounded-lg w-fit border border-slate-700">
            <span className="text-[10px] text-emerald-400 font-bold">صورة</span>
            <button onClick={clearSelectedImage} className="text-rose-500"><X className="w-3 h-3" /></button>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
          
          <button onClick={() => fileInputRef.current?.click()} className="p-2.5 bg-slate-800 text-slate-300 rounded-xl border border-slate-700">
            <ImageIcon className="w-4 h-4" />
          </button>

          <button onClick={toggleVoiceInput} className={`p-2.5 rounded-xl border border-slate-700 ${isListening ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-300'}`}>
            <Mic className="w-4 h-4" />
          </button>

          <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-rose-500 h-[42px] max-h-[80px] resize-none"
          />
          
          <button onClick={handleSend} disabled={isLoading || (!input.trim() && !selectedImage)} className="bg-rose-600 text-white p-2.5 rounded-xl disabled:opacity-50">
            <Send className="w-4 h-4 transform rotate-180" />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {messageToDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 w-full max-w-[250px] text-center shadow-2xl">
            <h3 className="text-base font-bold text-white mb-4">حذف الرسالة؟</h3>
            <div className="flex gap-3 justify-center">
               <button onClick={confirmDelete} className="flex-1 py-2 bg-rose-600 rounded-lg font-bold text-xs text-white">نعم</button>
               <button onClick={() => setMessageToDelete(null)} className="flex-1 py-2 bg-slate-700 rounded-lg font-bold text-xs text-white">لا</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatTutor;
