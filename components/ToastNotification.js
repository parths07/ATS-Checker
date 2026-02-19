import { useEffect } from 'react'

export default function ToastNotification({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: { border: '#4ade80', icon: 'M5 13l4 4L19 7' },
    error: { border: '#f87171', icon: 'M6 18L18 6M6 6l12 12' },
    warning: { border: '#facc15', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' }
  }

  const color = colors[type] || colors.success

  return (
    <div
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 min-w-[280px] max-w-[calc(100vw-2rem)] 
                 bg-white dark:bg-[#1a1a25] border border-[#e2e2ea] dark:border-[#2a2a3e] 
                 rounded-xl p-4 animate-fadeUp"
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: color.border,
        boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
      }}
    >
      <div className="flex items-start gap-3">
        <svg
          className="w-5 h-5 flex-shrink-0"
          style={{ color: color.border }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={color.icon} />
        </svg>
        <p className="text-[#0f0f18] dark:text-white text-sm flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-[#a0a0b8] dark:text-neutral-600 hover:text-[#0f0f18] dark:hover:text-white transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
