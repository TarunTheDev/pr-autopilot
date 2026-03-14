import React, { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

interface TopNavProps {
  active: 'dashboard' | 'history' | 'docs';
  onGoDashboard: () => void;
  onGoHistory: () => void;
  onSignOut: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  active,
  onGoDashboard,
  onGoHistory,
  onSignOut,
}) => {
  const [open, setOpen] = useState(false);

  const linkClass = (isActive: boolean) =>
    clsx(
      'px-3 py-2 rounded-lg text-sm transition-colors min-h-[44px] inline-flex items-center',
      isActive ? 'text-textPrimary bg-white/10' : 'text-textMuted hover:text-textPrimary hover:bg-white/5'
    );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05050f]/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <button onClick={onGoDashboard} className="flex items-center gap-2 text-xl font-display font-bold min-h-[44px]">
          <Zap className="text-warning fill-warning" size={24} />
          <span>PR Autopilot</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          <button onClick={onGoDashboard} className={linkClass(active === 'dashboard')}>Dashboard</button>
          <button onClick={onGoHistory} className={linkClass(active === 'history')}>History</button>
          <button className={linkClass(active === 'docs')}>Docs</button>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1.5 text-xs text-success">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            Agent Ready
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">TA</div>
          <button onClick={onSignOut} className="text-sm text-textMuted hover:text-textPrimary min-h-[44px] px-2">Sign Out</button>
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 bg-white/5 text-textPrimary md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#05050f]/90 px-4 py-3 md:hidden">
          <div className="grid gap-2">
            <button onClick={onGoDashboard} className={linkClass(active === 'dashboard')}>Dashboard</button>
            <button onClick={onGoHistory} className={linkClass(active === 'history')}>History</button>
            <button className={linkClass(active === 'docs')}>Docs</button>
            <button onClick={onSignOut} className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-left text-textMuted min-h-[44px]">Sign Out</button>
          </div>
        </div>
      )}
    </header>
  );
};
