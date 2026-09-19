import React, { useEffect, useCallback } from 'react';
import { useConfig } from '../context/ConfigContext';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const { setShowSettings } = useConfig();

  useEffect(() => {
    const shortcuts: KeyboardShortcut[] = [
      {
        key: ',',
        ctrl: true,
        action: () => setShowSettings(true),
        description: 'Open settings',
      },
      {
        key: 'k',
        ctrl: true,
        action: () => setShowSettings(true),
        description: 'Open settings (Cmd on Mac)',
      },
      {
        key: 'Escape',
        action: () => setShowSettings(false),
        description: 'Close modal',
      },
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey || e.key === shortcut.key;
        
        if (e.key.toLowerCase() === shortcut.key.toLowerCase() && ctrlMatch && shiftMatch) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowSettings]);
};

interface AriaAnnouncerProps {
  message: string;
}

export const AriaAnnouncer: React.FC<AriaAnnouncerProps> = ({ message }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
};

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ targetId, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
    >
      {children}
    </a>
  );
};

export const FocusTrap: React.FC<{ children: React.ReactNode; active?: boolean }> = ({ 
  children, 
  active = true 
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  return <div ref={containerRef}>{children}</div>;
};

export const useAnnounce = () => {
  const [announcement, setAnnouncement] = React.useState('');

  const announce = useCallback((message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  }, []);

  return { announce, announcement };
};

export const mergeRefs = <T extends HTMLElement>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> => {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref && 'current' in ref) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    });
  };
};

interface ARIA_LABELS {
  close: string;
  open: string;
  menu: string;
  previous: string;
  next: string;
  loading: string;
}

export const ariaLabels: ARIA_LABELS = {
  close: 'Close dialog',
  open: 'Open menu',
  menu: 'Navigation menu',
  previous: 'Previous item',
  next: 'Next item',
  loading: 'Loading, please wait',
};

export const FocusRing: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-dark rounded-xl">
    {children}
  </div>
);