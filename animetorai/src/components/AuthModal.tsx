import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onSuccess: (user: { id: number; username: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        if (isLogin) {
          onSuccess(data.user);
        } else {
          setIsLogin(true);
          setError('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-fuchsia-500/20 blur-[60px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/20 blur-[60px] rounded-full" />

        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="text-white" size={32} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            {isLogin ? 'Hoş Geldiniz' : 'Hesap Oluştur'}
          </h2>
          <p className="text-zinc-500 text-center text-sm mb-8">
            {isLogin ? 'Animax dünyasına giriş yapın' : 'Yaratıcılığınızı konuşturmaya başlayın'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Kullanıcı Adı"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all"
              />
            </div>

            {error && (
              <p className={`text-xs p-3 rounded-xl border ${error.includes('başarılı') ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'}`}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:from-fuchsia-400 hover:to-cyan-400 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-fuchsia-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
