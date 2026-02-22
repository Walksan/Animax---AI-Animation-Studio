import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, Rocket, ArrowRight, Code, Play, Download } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onGuestMode: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onGuestMode }) => {
  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden selection:bg-fuchsia-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-violet-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 border-b border-white/5 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter">ANIMAX</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-bold transition-all"
            >
              Giriş Yap
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-400 mb-8">
              Yapay Zeka Destekli Animasyon Stüdyosu
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
              HAYALLERİNİ <br />
              <span className="bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                KODA DÖNÜŞTÜR
              </span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
              Sadece ne istediğini yaz, Animax senin için saniyeler içinde profesyonel HTML ve CSS animasyonları oluştursun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-white text-black font-black rounded-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  ÜCRETSİZ BAŞLA <ArrowRight size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
              <button
                onClick={onGuestMode}
                className="px-8 py-4 bg-zinc-900 text-zinc-400 font-black rounded-2xl border border-zinc-800 transition-all hover:bg-zinc-800 hover:text-white active:scale-95"
              >
                MİSAFİR OLARAK DENE
              </button>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Zap className="text-fuchsia-500" />,
              title: "Işık Hızında",
              desc: "Gemini AI teknolojisi ile saniyeler içinde karmaşık animasyonlar üretin."
            },
            {
              icon: <Shield className="text-cyan-500" />,
              title: "Güvenli Saklama",
              desc: "Oluşturduğunuz tüm animasyonlar hesabınızda güvenle saklanır."
            },
            {
              icon: <Rocket className="text-violet-500" />,
              title: "Dışa Aktar",
              desc: "Tek tıkla HTML dosyası olarak indirin ve projelerinizde kullanın."
            }
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="p-8 bg-zinc-900/40 border border-zinc-800/50 rounded-[32px] backdrop-blur-xl"
            >
              <div className="w-12 h-12 bg-zinc-950 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Preview Section */}
        <div className="relative rounded-[48px] overflow-hidden border border-white/10 bg-zinc-900/20 backdrop-blur-3xl p-12 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6 leading-tight">
                Gelişmiş <br />
                Stüdyo Arayüzü
              </h2>
              <ul className="space-y-4">
                {[
                  { icon: <Play size={16} />, text: "Anlık görsel önizleme" },
                  { icon: <Code size={16} />, text: "Düzenlenebilir kod paneli" },
                  { icon: <Download size={16} />, text: "Temiz HTML/CSS çıktısı" }
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-400 font-bold text-sm uppercase tracking-widest">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center border border-zinc-800 text-fuchsia-500">
                      {item.icon}
                    </div>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video bg-zinc-950 rounded-3xl border border-zinc-800 shadow-2xl overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white/5 rounded-full border border-white/10 flex items-center justify-center animate-bounce">
                    <Sparkles className="text-fuchsia-500" size={40} />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-white/5">
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">
            © 2026 ANIMAX STUDIO • FUTURE OF WEB ANIMATION
          </p>
        </footer>
      </div>
    </div>
  );
};
