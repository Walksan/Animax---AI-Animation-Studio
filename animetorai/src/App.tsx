/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, Loader2, Wand2, History, Code, Play, LogOut, User as UserIcon } from 'lucide-react';
import { generateAnimation } from './lib/gemini';
import { AnimationCode, GenerationState, User } from './types';
import { PreviewWindow } from './components/PreviewWindow';
import { CodePanel } from './components/CodePanel';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [guestCount, setGuestCount] = useState(0);
  const GUEST_LIMIT = 3;
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    code: null,
  });
  const [history, setHistory] = useState<{ prompt: string; code: AnimationCode }[]>([]);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');

  // Load user from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('animax_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuthSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('animax_user', JSON.stringify(userData));
    setShowAuth(false);
  };

  const handleGuestMode = () => {
    const guestUser: User = { id: -1, username: 'Misafir', isGuest: true };
    setUser(guestUser);
    // We don't save guest to localStorage to keep it temporary
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('animax_user');
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || state.isLoading) return;

    if (user?.isGuest && guestCount >= GUEST_LIMIT) {
      setState(prev => ({ 
        ...prev, 
        error: 'Misafir modu limitine ulaştınız (3/3). Daha fazla oluşturmak için lütfen kayıt olun.' 
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await generateAnimation(prompt);
      setState({
        isLoading: false,
        error: null,
        code: result,
      });
      setHistory(prev => [{ prompt, code: result }, ...prev].slice(0, 10));
      setViewMode('preview');
      if (user?.isGuest) {
        setGuestCount(prev => prev + 1);
      }
    } catch (err) {
      setState({
        isLoading: false,
        error: 'Animasyon oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.',
        code: null,
      });
    }
  };

  const loadFromHistory = (item: { prompt: string; code: AnimationCode }) => {
    setPrompt(item.prompt);
    setState(prev => ({ ...prev, code: item.code }));
    setViewMode('preview');
  };

  const samplePrompts = [
    { icon: '🌈', text: 'Gökkuşağı neon dalgaları' },
    { icon: '✨', text: 'Parıldayan galaksi tozu' },
    { icon: '🔥', text: 'Soyut ateş dansı efekti' },
    { icon: '🧊', text: 'Buz kristali büyüme animasyonu' },
    { icon: '🌀', text: 'Hipnotik sarmal geçiş' },
  ];

  if (!user) {
    return (
      <>
        <LandingPage 
          onGetStarted={() => setShowAuth(true)} 
          onGuestMode={handleGuestMode}
        />
        {showAuth && <AuthModal onSuccess={handleAuthSuccess} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      {/* Background Glows - More Vibrant */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-fuchsia-600/20 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-cyan-600/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-500/20">
              <Sparkles className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">ANIMAX</h1>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">Next-Gen Animation Studio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-800 shadow-xl">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Play size={14} /> İzle
              </button>
              <button
                onClick={() => setViewMode('code')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  viewMode === 'code' ? 'bg-zinc-800 text-white shadow-inner' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Code size={14} /> Kod
              </button>
            </div>

            <div className="h-8 w-[1px] bg-zinc-800" />

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/50 rounded-full border border-zinc-800">
                  <div className={`w-6 h-6 ${user.isGuest ? 'bg-zinc-700' : 'bg-fuchsia-500'} rounded-full flex items-center justify-center`}>
                    <UserIcon size={12} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-zinc-300">
                    {user.username} {user.isGuest && `(${guestCount}/${GUEST_LIMIT})`}
                  </span>
                </div>
                {user.isGuest && (
                  <button
                    onClick={() => setShowAuth(true)}
                    className="text-[10px] font-black text-fuchsia-500 hover:text-fuchsia-400 uppercase tracking-widest transition-colors"
                  >
                    Kayıt Ol
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Çıkış Yap"
                >
                  <LogOut size={20} />
                </button>
              </div>
          </div>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-0">
          {/* Left Panel: Input & History */}
          <div className="lg:col-span-4 flex flex-col gap-6 min-h-0">
            <div className="bg-zinc-900/40 p-8 rounded-[32px] border border-zinc-800/50 backdrop-blur-2xl shadow-2xl">
              <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Wand2 size={16} className="text-fuchsia-500" /> Hayal Gücünü Yaz
              </h2>
              <form onSubmit={handleGenerate} className="space-y-6">
                <div className="relative group">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Örn: 'Karanlıkta parlayan neon bir sarmal'..."
                    className="w-full h-40 bg-zinc-950/50 border border-zinc-800 rounded-3xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/30 transition-all resize-none placeholder:text-zinc-800 leading-relaxed"
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] text-zinc-700 font-bold">AI POWERED</div>
                </div>
                <button
                  type="submit"
                  disabled={state.isLoading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-400 hover:to-cyan-400 disabled:opacity-50 text-white font-black py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-fuchsia-500/20 active:scale-[0.98] uppercase tracking-widest text-xs"
                >
                  {state.isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Oluşturuluyor
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Oluştur
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8">
                <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-black mb-4">Popüler İstekler</p>
                <div className="flex flex-wrap gap-2">
                  {samplePrompts.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(sample.text)}
                      className="text-[10px] font-bold bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-xl transition-all flex items-center gap-2 hover:border-fuchsia-500/50"
                    >
                      <span className="text-sm">{sample.icon}</span>
                      {sample.text}
                    </button>
                  ))}
                </div>
              </div>

              {state.error && (
                <p className="mt-6 text-[11px] text-red-400 bg-red-400/5 p-4 rounded-2xl border border-red-400/10 font-medium">
                  {state.error}
                </p>
              )}
            </div>

            {/* History */}
            <div className="flex-1 bg-zinc-900/20 rounded-[32px] border border-zinc-800/30 p-8 flex flex-col min-h-0 backdrop-blur-sm">
              <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <History size={16} /> Koleksiyonun
              </h2>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                      <History size={20} className="text-zinc-700" />
                    </div>
                    <p className="text-zinc-700 text-xs font-bold uppercase tracking-widest">Henüz bir şey yok</p>
                  </div>
                ) : (
                  history.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:border-fuchsia-500/30 hover:bg-zinc-800/30 transition-all group"
                    >
                      <p className="text-xs font-bold text-zinc-400 line-clamp-2 group-hover:text-zinc-200 transition-colors leading-relaxed">
                        {item.prompt}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Preview/Code */}
          <div className="lg:col-span-8 flex flex-col min-h-0">
            <AnimatePresence mode="wait">
              {viewMode === 'preview' ? (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="flex-1 min-h-0"
                >
                  <PreviewWindow code={state.code} isLoading={state.isLoading} />
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="flex-1 min-h-0"
                >
                  {state.code ? (
                    <CodePanel code={state.code} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/20 rounded-[40px] border border-zinc-800/50 border-dashed">
                      <div className="w-16 h-16 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 border border-zinc-800">
                        <Code size={24} className="text-zinc-700" />
                      </div>
                      <p className="text-zinc-600 font-black uppercase tracking-[0.2em] text-xs">Kod Görüntülenemiyor</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-8 py-6 border-t border-zinc-800/30 flex justify-between items-center text-[9px] text-zinc-600 uppercase tracking-[0.3em] font-black">
          <p>© 2026 Animax Studio • Creative AI Engine</p>
          <div className="flex gap-8">
            <span className="hover:text-fuchsia-500 cursor-help transition-colors">Vibrant UI</span>
            <span className="hover:text-cyan-500 cursor-help transition-colors">No-Click Logic</span>
            <span className="hover:text-violet-500 cursor-help transition-colors">Secure Auth</span>
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #18181b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #27272a;
        }
      `}</style>
    </div>
  );
}
