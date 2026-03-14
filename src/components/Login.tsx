import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const valid = /.+@.+\..+/.test(email) && password.length >= 6;
    if (!valid) {
      setError(true);
      setTimeout(() => setError(false), 450);
      return;
    }
    onSuccess();
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-glow-purple backdrop-blur-xl"
      >
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-[28px] font-display font-bold">
            <span aria-hidden="true">⚡</span>
            <span>PR Autopilot</span>
          </div>
          <p className="text-textMuted mt-2">AI-Powered Code Review Agent</p>
        </div>

        <div className="h-px bg-white/10 mb-6" />

        <h1 className="text-3xl font-display font-bold">Welcome back</h1>
        <p className="text-textMuted mt-2 mb-6">Sign in to start evaluating pull requests</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="sr-only">Email</span>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className={`h-12 w-full rounded-xl border bg-dark/70 pl-10 pr-4 text-textPrimary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 ${error ? 'border-danger animate-shake-x' : 'border-white/10'}`}
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className={`h-12 w-full rounded-xl border bg-dark/70 pl-10 pr-12 text-textPrimary outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/40 ${error ? 'border-danger animate-shake-x' : 'border-white/10'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-textMuted min-h-[32px] min-w-[32px]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="text-right">
            <button type="button" className="text-sm text-primary/90 hover:text-primary">Forgot password?</button>
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-gradient-to-r from-primary via-secondary to-accent px-4 font-display font-bold text-white shadow-glow-purple transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In →
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-textMuted text-sm">
          <div className="h-px flex-1 bg-white/10" />
          <span>or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button className="h-12 w-full rounded-xl border border-white/30 bg-white text-[#111827] font-medium transition-all hover:brightness-105">
          Continue with Google
        </button>

        <p className="text-center text-sm text-textMuted mt-5">
          New here? <button className="text-primary hover:text-primary/80">Create account →</button>
        </p>
      </motion.div>
    </main>
  );
};
