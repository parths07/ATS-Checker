import ThemeToggle from './ThemeToggle'

export default function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#e2e2ea] dark:border-brand-border 
                    bg-[rgba(245,245,250,0.85)] dark:bg-[rgba(10,10,15,0.85)]" 
         style={{ backdropFilter: 'blur(12px)' }}>
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-accent rounded flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[#0f0f18] dark:text-white font-bold text-lg">ATS Check</span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-3 py-1 rounded-full font-medium">
            Free Tool
          </span>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  )
}
