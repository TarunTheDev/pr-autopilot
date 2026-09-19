import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  glow = false,
  onClick,
  type = 'button',
}) => {
  const variants = {
    primary: clsx(
      'bg-gradient-to-r from-primary to-secondary text-white shadow-lg',
      'hover:shadow-glow-purple hover:scale-[1.02] active:scale-[0.98]',
      glow && 'animate-glow-pulse'
    ),
    secondary: 'bg-secondary/20 text-secondary border border-secondary/30 hover:bg-secondary/30 hover:shadow-glow-cyan',
    ghost: 'bg-transparent hover:bg-white/10 text-textSecondary hover:text-textPrimary',
    danger: 'bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30 hover:shadow-glow-red',
    success: 'bg-success/20 text-success border border-success/30 hover:bg-success/30 hover:shadow-glow-green',
    outline: 'bg-transparent border border-white/20 text-textPrimary hover:bg-white/5 hover:border-white/30',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-xl',
    xl: 'px-8 py-4 text-xl rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      onClick={onClick}
      type={type}
      className={clsx(
        'font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300',
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </motion.button>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  glow?: 'purple' | 'cyan' | 'pink' | 'green' | 'none';
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  glow = 'none',
  onClick,
  hover = true,
}) => {
  const glowStyles = {
    purple: 'hover:shadow-glow-purple',
    cyan: 'hover:shadow-glow-cyan',
    pink: 'hover:shadow-glow-pink',
    green: 'hover:shadow-glow-green',
    none: '',
  };

  const variants = {
    default: 'bg-dark border border-white/10',
    gradient: 'gradient-border',
    glass: 'glass-card',
    elevated: 'bg-dark/90 border border-white/10 shadow-neo-lg',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300',
        variants[variant],
        glowStyles[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  pill?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  pill = true,
}) => {
  const variants = {
    default: 'bg-white/10 text-textSecondary border-white/20',
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    danger: 'bg-danger/20 text-danger border-danger/30',
    info: 'bg-secondary/20 text-secondary border-secondary/30',
    primary: 'bg-primary/20 text-primary border-primary/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium border',
        pill ? 'rounded-full' : 'rounded-lg',
        variants[variant],
        sizes[size],
        glow && 'shadow-lg'
      )}
    >
      {children}
    </span>
  );
};

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  striped?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  variant = 'primary',
  size = 'md',
  animated = true,
  striped = false,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  
  const variants = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-emerald-400',
    warning: 'from-warning to-amber-400',
    danger: 'from-danger to-rose-500',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className="w-full">
      <div className={clsx('w-full bg-white/10 rounded-full overflow-hidden', sizes[size])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: animated ? `${percentage}%` : `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={clsx(
            'h-full bg-gradient-to-r rounded-full',
            variants[variant],
            striped && 'bg-stripes'
          )}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-textMuted mt-1 block text-right">{Math.round(percentage)}%</span>
      )}
    </div>
  );
};

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = React.useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
        transition={{ duration: 0.15 }}
        className={clsx(
          'absolute z-50 pointer-events-none',
          'bg-dark/95 backdrop-blur-md text-textPrimary text-sm px-3 py-1.5 rounded-lg border border-white/10',
          'whitespace-nowrap',
          positions[position]
        )}
      >
        {content}
      </motion.div>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className, 
  variant = 'text',
  width,
  height,
}) => {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <motion.div
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
      className={clsx(
        'bg-gradient-to-r from-white/10 via-white/20 to-white/10 bg-[length:200%_100%] animate-shimmer',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
}) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={clsx('glass-card w-full p-6 max-h-[90vh] overflow-y-auto', sizes[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="text-xl font-display font-bold text-textPrimary">{title}</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-textMuted hover:text-textPrimary"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex gap-2 p-1 bg-dark/50 rounded-xl w-fit">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
            activeTab === tab.id
              ? 'bg-primary text-white shadow-lg'
              : 'text-textMuted hover:text-textPrimary hover:bg-white/5'
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ 
  orientation = 'horizontal', 
  className = '' 
}) => {
  return (
    <div
      className={clsx(
        'bg-white/10',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
};

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  };

  const [error, setError] = React.useState(false);

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={clsx('rounded-full object-cover', sizes[size])}
        onError={() => setError(true)}
      />
    );
  }

  return (
    <div className={clsx(
      'rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-bold text-primary',
      sizes[size]
    )}>
      {fallback || '?'}
    </div>
  );
};

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export const Switch: React.FC<SwitchProps> = ({ 
  checked, 
  onChange, 
  disabled = false,
  label,
}) => {
  return (
    <label className={clsx('flex items-center gap-3 cursor-pointer', disabled && 'opacity-50 cursor-not-allowed')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={clsx(
          'relative w-12 h-6 rounded-full transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-white/20'
        )}
      >
        <motion.div
          animate={{ x: checked ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
        />
      </button>
      {label && <span className="text-sm text-textSecondary">{label}</span>}
    </label>
  );
};