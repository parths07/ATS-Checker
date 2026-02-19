import { useState } from 'react'

const priorityColors = {
  1: { border: '#5b6ef5', bg: '#5b6ef5' },
  2: { border: '#60a5fa', bg: '#60a5fa' },
  3: { border: '#a855f7', bg: '#a855f7' },
  4: { border: '#8b5cf6', bg: '#8b5cf6' },
  5: { border: '#64748b', bg: '#64748b' }
}

const categoryColors = {
  'Skills': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  'Experience': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  'Language': { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
  'Format': { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  'Keywords': { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  'Certification': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  'Resume': { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' }
}

function SuggestionCard({ suggestion, index }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const priority = suggestion.priority || (index + 1)
  const colors = priorityColors[priority] || priorityColors[5]
  const categoryColor = categoryColors[suggestion.category] || categoryColors['Skills']

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion.example)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="bg-white dark:bg-brand-card border border-[#e2e2ea] dark:border-brand-border 
                 rounded-r-xl rounded-l-none p-5 hover:border-[#c8c8d8] dark:hover:border-brand-borderHover transition-colors"
      style={{ borderLeftWidth: '3px', borderLeftColor: colors.border }}
    >
      {/* Top Row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: colors.bg }}
          >
            {priority}
          </div>
          <span className={`${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border} text-xs px-2 py-0.5 rounded-full`}>
            {suggestion.category}
          </span>
        </div>
        <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-xs px-2 py-1 rounded-full font-semibold">
          +{suggestion.estimatedScoreImprovement} pts
        </span>
      </div>

      {/* Suggestion Text */}
      <p className="text-[#0f0f18] dark:text-white font-medium text-sm leading-relaxed">
        {suggestion.suggestion}
      </p>

      {/* Expand Toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-brand-accent text-xs mt-3 hover:text-brand-accentHover transition-colors"
      >
        <span>Why this matters + see example</span>
        <svg
          className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#e2e2ea] dark:border-brand-border space-y-4">
          {/* Why */}
          <div>
            <p className="text-[#a0a0b8] dark:text-neutral-600 text-xs uppercase tracking-wider mb-1">WHY</p>
            <p className="text-[#555566] dark:text-neutral-400 text-sm leading-relaxed">{suggestion.why}</p>
          </div>

          {/* Example */}
          {suggestion.example && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-[#a0a0b8] dark:text-neutral-600 text-xs uppercase tracking-wider">EXAMPLE</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[#a0a0b8] dark:text-neutral-600 
                           hover:text-[#0f0f18] dark:hover:text-white text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-[#f0f0f6] dark:bg-neutral-900 border border-[#e2e2ea] dark:border-neutral-800 rounded-lg p-3 relative">
                <p className="text-[#555566] dark:text-neutral-300 text-sm italic leading-relaxed">{suggestion.example}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function SuggestionsSection({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null

  const sortedSuggestions = [...suggestions].sort((a, b) => (a.priority || 0) - (b.priority || 0))

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[#0f0f18] dark:text-white font-bold text-xl">How to Improve</h2>
        <p className="text-[#8888a0] dark:text-neutral-500 text-sm mt-1">Prioritized actions to boost your ATS score</p>
      </div>

      {/* Suggestions List */}
      <div className="space-y-3">
        {sortedSuggestions.map((suggestion, index) => (
          <SuggestionCard key={index} suggestion={suggestion} index={index} />
        ))}
      </div>
    </div>
  )
}
