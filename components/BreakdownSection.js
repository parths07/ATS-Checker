import { useState } from 'react'

function getScoreColor(score) {
  if (score >= 90) return '#4ade80'
  if (score >= 80) return '#60a5fa'
  if (score >= 70) return '#facc15'
  if (score >= 60) return '#fb923c'
  return '#f87171'
}

function BreakdownCard({ title, icon, score, weight, analysis, details }) {
  const [expanded, setExpanded] = useState(false)
  const scoreColor = getScoreColor(score)

  return (
    <div className="bg-white dark:bg-brand-card border border-[#e2e2ea] dark:border-brand-border rounded-2xl p-6 
                    hover:border-[#c8c8d8] dark:hover:border-brand-borderHover 
                    hover:bg-[#f9f9fc] dark:hover:bg-brand-cardHover transition-all">
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-brand-accent">{icon}</div>
          <div>
            <h3 className="text-[#0f0f18] dark:text-white font-semibold text-base">{title}</h3>
            <span className="inline-block mt-1 bg-[#f0f0f6] dark:bg-neutral-800 
                           text-[#8888a0] dark:text-neutral-500 text-xs px-2 py-0.5 rounded">
              {weight}% weight
            </span>
          </div>
        </div>
      </div>

      {/* Score */}
      <div className="flex items-end gap-1 mb-3">
        <span className="text-4xl font-black" style={{ color: scoreColor }}>
          {score}
        </span>
        <span className="text-neutral-600 text-sm mb-1">/100</span>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#e2e2ea] dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${score}%`,
            backgroundColor: scoreColor,
            transitionDelay: '0.3s'
          }}
        />
      </div>

      {/* Analysis */}
      <p className="text-[#555566] dark:text-neutral-400 text-sm leading-relaxed line-clamp-3">
        {analysis}
      </p>

      {/* Expand Toggle */}
      {details && details.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-brand-accent text-xs mt-4 hover:text-brand-accentHover transition-colors"
          >
            <span>View details</span>
            <svg
              className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expanded && (
            <div className="mt-4 pt-4 border-t border-[#e2e2ea] dark:border-brand-border space-y-2">
              {details.map((detail, idx) => {
                const isPositive = detail.includes('Matched') || detail.startsWith('✓')
                const isNegative = detail.includes('Missing') || detail.startsWith('✗')
                
                return (
                  <div key={idx} className="flex items-start gap-2 text-xs">
                    <span className={isPositive ? 'text-green-400' : isNegative ? 'text-red-400' : 'text-neutral-400'}>
                      {isPositive ? '●' : isNegative ? '●' : '●'}
                    </span>
                    <span className={`flex-1 ${isNegative ? 'line-through text-[#8888a0] dark:text-neutral-500' : 'text-[#555566] dark:text-neutral-300'}`}>
                      {detail.replace(/^[✓✗]\s*/, '')}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default function BreakdownSection({ keywordMatch, contextualMatch, textSimilarity }) {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <h2 className="text-[#0f0f18] dark:text-white font-bold text-lg md:text-xl">Score Breakdown</h2>
        <span className="text-[#a0a0b8] dark:text-neutral-600 text-xs">Weighted across 3 dimensions</span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <BreakdownCard
          title="Keyword Matching"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          }
          score={keywordMatch.score}
          weight={20}
          analysis={keywordMatch.analysis}
          details={[
            ...(keywordMatch.matchedSkills?.length > 0 
              ? [`Matched: ${keywordMatch.matchedSkills.join(', ')}`] 
              : []),
            ...(keywordMatch.missingRequiredSkills?.length > 0 
              ? [`Missing: ${keywordMatch.missingRequiredSkills.join(', ')}`] 
              : [])
          ]}
        />

        <BreakdownCard
          title="Contextual Matching"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          score={contextualMatch.score}
          weight={50}
          analysis={contextualMatch.analysis}
          details={[
            ...(contextualMatch.alignedAspects?.length > 0 
              ? contextualMatch.alignedAspects.map(a => `✓ ${a}`) 
              : []),
            ...(contextualMatch.gaps?.length > 0 
              ? contextualMatch.gaps.map(g => `✗ ${g}`) 
              : [])
          ]}
        />

        <BreakdownCard
          title="Text Similarity"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          score={textSimilarity.score}
          weight={30}
          analysis={textSimilarity.analysis}
          details={[
            ...(textSimilarity.wellMatchedAreas?.length > 0 
              ? textSimilarity.wellMatchedAreas.map(a => `✓ ${a}`) 
              : []),
            ...(textSimilarity.poorlyMatchedAreas?.length > 0 
              ? textSimilarity.poorlyMatchedAreas.map(a => `✗ ${a}`) 
              : [])
          ]}
        />
      </div>
    </div>
  )
}
