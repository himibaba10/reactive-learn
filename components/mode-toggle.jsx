'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Render a neutral placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className='theme-toggle-track'>
        <div className='theme-toggle-btn'>☀️</div>
      </div>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <label className='relative inline-flex items-center cursor-pointer'>
      <input type='checkbox' className='sr-only' checked={isDark} onChange={() => setTheme(isDark ? 'light' : 'dark')} />
      <div className={`theme-toggle-track ${isDark ? 'is-dark' : ''}`}>
        <div className='theme-toggle-btn'>{isDark ? '🌙' : '☀️'}</div>
      </div>
    </label>
  );
}

