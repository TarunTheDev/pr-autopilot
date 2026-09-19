import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const TOAST_THEME = {
  success: { color: '#06d6a0', icon: <CheckCircle2 size={18} /> },
  error: { color: '#ef476f', icon: <XCircle size={18} /> },
  warning: { color: '#ffbe0b', icon: <AlertTriangle size={18} /> },
  info: { color: '#3a86ff', icon: <Info size={18} /> },
} as const;

type ToastType = keyof typeof TOAST_THEME;

export const Toast: React.FC = () => {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <div className="retro-scope fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: { id: string; message: string; type: ToastType; duration?: number };
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 4000;
  const theme = TOAST_THEME[toast.type] ?? TOAST_THEME.info;

  useEffect(() => {
    if (duration <= 0) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [toast.id, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 90, rotate: 4 }}
      animate={{ opacity: 1, x: 0, rotate: -1 }}
      exit={{ opacity: 0, x: 90, rotate: 4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className="retro-card overflow-hidden"
      role="status"
      aria-live="polite"
    >
      {/* color spine */}
      <div className="flex">
        <div className="w-2.5 shrink-0 border-r-2 border-ink" style={{ background: theme.color }} />
        <div className="flex items-start gap-3 p-4 flex-1 bg-[#fffdf6]">
          <span
            className="w-8 h-8 shrink-0 border-2 border-ink rounded-lg flex items-center justify-center text-ink shadow-retro-sm mt-0.5"
            style={{ background: theme.color }}
          >
            {theme.icon}
          </span>
          <p className="font-mono text-xs font-bold text-ink flex-1 leading-relaxed">{toast.message}</p>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            aria-label="Close notification"
            className="shrink-0 w-6 h-6 border-2 border-ink rounded-md bg-paper flex items-center justify-center text-ink hover:bg-retro-red transition-colors"
          >
            <X size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {duration > 0 && (
        <div className="h-1.5 border-t-2 border-ink bg-paper-dim">
          <div className="h-full transition-none" style={{ width: `${progress}%`, background: theme.color }} />
        </div>
      )}
    </motion.div>
  );
};
