'use client'

import { useDarkMode } from '@/hooks/useDarkMode'

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )
}

export default function Nav() {
  const { isDark, toggle } = useDarkMode()

  return (
    <nav
      className="sticky top-0 z-[100] border-b border-[var(--border)]"
      style={{ backgroundColor: 'var(--bg-nav)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={toggle}
          aria-label="Toggle dark mode"
          className="text-subtle hover:text-accent transition-colors duration-200"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <span
            style={{
              display: 'inline-flex',
              transition: 'transform 0.2s ease, opacity 0.2s ease',
              transform: 'scale(1)',
              opacity: 1,
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </span>
        </button>

        <div className="flex gap-8 text-sm font-sans text-muted">
          <a href="#projects" className="hover:text-accent transition-colors duration-200">
            Projects
          </a>
          <a href="#experience" className="hover:text-accent transition-colors duration-200">
            Experience
          </a>
          <a href="#blog" className="hover:text-accent transition-colors duration-200">
            Blogs
          </a>
          <a href="#contact" className="hover:text-accent transition-colors duration-200">
            Contact
          </a>
        </div>
      </div>
    </nav>
  )
}
