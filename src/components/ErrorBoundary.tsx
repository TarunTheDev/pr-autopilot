import React, { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="retro-scope retro-paper-bg retro-grain min-h-screen flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="max-w-lg w-full retro-card relative overflow-hidden"
          >
            <div className="retro-window-bar">
              <span className="retro-window-dot bg-retro-red" />
              <span className="retro-window-dot bg-retro-yellow" />
              <span className="retro-window-dot bg-retro-green" />
              <span className="ml-3 retro-pixel-tag text-ink/70">crash-report.txt</span>
            </div>

            <div className="p-8 sm:p-10 text-center bg-[#fffdf6]">
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [0, -3, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="w-20 h-20 mx-auto mb-7 border-2 border-ink rounded-2xl bg-retro-red flex items-center justify-center shadow-retro-md"
              >
                <AlertTriangle size={38} className="text-ink" strokeWidth={2.5} />
              </motion.div>

              <h2 className="font-display-retro text-2xl sm:text-3xl text-ink mb-3">
                SOMETHING <span className="retro-marker">SNAPPED.</span>
              </h2>

              <p className="font-mono text-sm text-ink-soft mb-7 leading-relaxed">
                The machine jammed. Nothing was lost — hit retry, or head home and start fresh.
              </p>

              {import.meta.env.MODE === 'development' && this.state.error && (
                <div className="retro-scanlines mb-7 p-4 rounded-xl text-left border-2 border-ink bg-ink shadow-retro-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Terminal size={13} className="text-retro-red" />
                    <span className="retro-pixel-tag text-retro-red">ERROR LOG</span>
                  </div>
                  <p className="text-xs text-retro-red font-mono break-all leading-relaxed">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <p className="text-[10px] text-paper/50 font-mono mt-2 break-all">
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button type="button" onClick={this.handleRetry} className="retro-btn retro-btn-yellow px-6 py-3 text-sm">
                  <RefreshCw size={15} /> TRY AGAIN
                </button>
                <button type="button" onClick={this.handleGoHome} className="retro-btn px-6 py-3 text-sm">
                  <Home size={15} /> GO HOME
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

