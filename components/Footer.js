export default function Footer() {
  return (
    <footer className="mt-16 pb-10 border-t border-[#e2e2ea] dark:border-neutral-900">
      <div className="max-w-[1200px] mx-auto px-4 pt-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-brand-accent rounded flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-[#0f0f18] dark:text-white font-bold">ATS Check</span>
        </div>
        <p className="text-[#a0a0b8] dark:text-neutral-600 text-sm">
          Free AI-powered resume scanner. No signup. No storage.
        </p>
        <div className="flex items-center justify-center gap-2 text-[#c8c8d8] dark:text-neutral-700 text-xs mt-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
    </footer>
  )
}
