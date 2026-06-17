import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../features/ui/uiSlice';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-white/[0.05] text-slate-600 dark:text-slate-400"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <FiSun size={15} /> : <FiMoon size={15} />}
    </button>
  );
};

export default ThemeToggle;
