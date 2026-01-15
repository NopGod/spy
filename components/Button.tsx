import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg";
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-indigo-500/30",
    secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-red-500/30",
    ghost: "bg-transparent text-slate-400 hover:text-white shadow-none"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};