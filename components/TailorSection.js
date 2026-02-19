import { useState, useRef } from 'react'

export default function TailorSection({ theme, resumeData }) {
  const [tailoredResult, setTailoredResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeLineIndex, setActiveLineIndex] = useState(null)
  const [activeSuggestionId, setActiveSuggestionId] = useState(null)
  const leftPanelRef = useRef(null)
  const rightPanelRef = useRef(null)

  const handleTailor = async () => {
    if (!resumeData) return

    setIsLoading(true)
    setTailoredResult(null)
    setActiveLineIndex(null)
    setActiveSuggestionId(null)

    try {
      const response = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeText: resumeData.resumeText, 
          jobDescription: resumeData.jobDescription 
        })
      })

      const data = await response.json()

      if (response.ok) {
        setTailoredResult(data)
      }
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  const findSuggestionsForLine = (lineText, lineIndex) => {
    if (!tailoredResult?.improvements || !lineText.trim()) return []
    
    const normalizedLine = lineText.toLowerCase().trim()
    
    return tailoredResult.improvements
      .map((imp, idx) => ({
        ...imp,
        id: idx,
        similarity: calculateSimilarity(normalizedLine, imp.before.toLowerCase().trim())
      }))
      .filter(imp => imp.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
  }

  const findRelevantKeywordsForLine = (lineText) => {
    if (!tailoredResult?.missingKeywords || !lineText.trim()) return []
    
    const normalizedLine = lineText.toLowerCase()
    const lineWords = normalizedLine.split(/\s+/)
    
    return tailoredResult.missingKeywords.filter(keyword => {
      const keywordLower = keyword.toLowerCase()
      const keywordWords = keywordLower.split(/\s+/)
      
      const hasPartialMatch = keywordWords.some(kw => 
        lineWords.some(lw => lw.includes(kw) || kw.includes(lw))
      )
      
      const isContextuallyRelevant = 
        (normalizedLine.includes('skill') || normalizedLine.includes('experience') || 
         normalizedLine.includes('develop') || normalizedLine.includes('work')) &&
        keywordWords.length <= 3
      
      return hasPartialMatch || isContextuallyRelevant
    }).slice(0, 5)
  }

  const calculateSimilarity = (str1, str2) => {
    if (str1 === str2) return 1
    if (str1.includes(str2) || str2.includes(str1)) return 0.8
    
    const words1 = str1.split(/\s+/)
    const words2 = str2.split(/\s+/)
    const commonWords = words1.filter(w => words2.includes(w) && w.length > 3)
    
    if (commonWords.length === 0) return 0
    
    return commonWords.length / Math.max(words1.length, words2.length)
  }

  const parseResumeIntoSections = (text) => {
    const lines = text.split('\n').map(line => line.trimEnd())
    const sections = []
    let currentSection = { title: 'Header', lines: [], startIndex: 0 }

    const sectionHeaders = /^(summary|professional summary|experience|work experience|education|skills|technical skills|certifications?|projects?|achievements?|objective|career objective)/i

    lines.forEach((line, idx) => {
      const trimmedLine = line.trim()
      
      if (trimmedLine && sectionHeaders.test(trimmedLine)) {
        if (currentSection.lines.length > 0) {
          sections.push(currentSection)
        }
        currentSection = { 
          title: trimmedLine, 
          lines: [], 
          startIndex: idx 
        }
      } else {
        currentSection.lines.push({ text: line, index: idx })
      }
    })

    if (currentSection.lines.length > 0) {
      sections.push(currentSection)
    }

    return sections
  }

  const sections = resumeData ? parseResumeIntoSections(resumeData.resumeText) : []

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (!resumeData) {
    return null
  }

  return (
    <div className="mt-12">
      <div className="mb-6">
        <h2 className="text-[#0f0f18] dark:text-white font-bold text-2xl">AI Resume Tailor</h2>
        <p className="text-[#8888a0] dark:text-neutral-500 text-sm mt-1">
          Get personalized suggestions to optimize your resume for this specific job
        </p>
      </div>

      {!tailoredResult && !isLoading && (
        <div className="bg-white dark:bg-brand-card border border-[#e2e2ea] dark:border-brand-border rounded-2xl p-8 text-center">
          <svg className="w-12 h-12 text-brand-accent mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="text-[#0f0f18] dark:text-white font-semibold text-lg mb-2">
            Ready to tailor your resume?
          </h3>
          <p className="text-[#8888a0] dark:text-neutral-500 text-sm mb-6 max-w-md mx-auto">
            Click below to get AI-powered suggestions including rewritten bullet points, missing keywords, and section improvements
          </p>
          <button
            onClick={handleTailor}
            className="bg-brand-accent hover:bg-brand-accentHover text-white font-semibold rounded-xl px-8 py-3 
                     flex items-center gap-2 mx-auto hover:scale-105 transition-all"
            style={{ boxShadow: '0 4px 16px rgba(91,110,245,0.2)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            Tailor Now
          </button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-6">
          <div className="bg-neutral-800/50 rounded-2xl h-64 animate-pulse" />
          <div className="bg-neutral-800/50 rounded-2xl h-96 animate-pulse" />
        </div>
      )}

      {tailoredResult && (
        <div className="space-y-6 animate-fadeUp">
          <div className="bg-white dark:bg-brand-card border border-[#e2e2ea] dark:border-brand-border rounded-2xl overflow-hidden">
            <div className="flex flex-col-reverse lg:flex-row" style={{ minHeight: '600px' }}>
              <div 
                ref={leftPanelRef}
                className="w-full lg:w-[40%] lg:border-b-0 lg:border-r border-[#e2e2ea] dark:border-brand-border 
                         overflow-y-auto p-6 bg-white dark:bg-[#0e0e16]"
                style={{ maxHeight: '600px' }}
              >
                <div className="mb-4 pb-3 border-b border-[#e2e2ea] dark:border-brand-border">
                  <h3 className="text-[#0f0f18] dark:text-white font-semibold text-base mb-3">Resume Viewer</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-2 py-1">
                      <div className="bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        #
                      </div>
                      <span className="text-[#555566] dark:text-neutral-400 font-medium">Suggestions</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full px-2 py-1">
                      <div className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        #
                      </div>
                      <span className="text-[#555566] dark:text-neutral-400 font-medium">Keywords</span>
                    </div>
                  </div>
                  <p className="text-[#8888a0] dark:text-neutral-500 text-xs mt-2">
                    <span className="lg:hidden">Click lines with badges to see inline suggestions</span>
                    <span className="hidden lg:inline">Lines with badges have AI suggestions - click to view details</span>
                  </p>
                </div>

                <div className="space-y-4 font-mono text-xs leading-relaxed">
                  {sections.map((section, sIdx) => (
                    <div key={sIdx}>
                      <div className="text-brand-accent font-bold mb-2 uppercase tracking-wide text-sm">
                        {section.title}
                      </div>
                      <div className="space-y-0">
                        {section.lines.map((line, lIdx) => {
                          const globalIdx = section.startIndex + lIdx
                          const isActive = activeLineIndex === globalIdx
                          const isEmpty = !line.text.trim()
                          const suggestions = findSuggestionsForLine(line.text, globalIdx)
                          const relevantKeywords = findRelevantKeywordsForLine(line.text)
                          const hasSuggestions = suggestions.length > 0
                          const hasKeywords = relevantKeywords.length > 0
                          const hasAnyContent = hasSuggestions || hasKeywords
                          
                          let borderColor = ''
                          let bgColor = ''
                          let hoverBg = ''
                          if (hasSuggestions && hasKeywords) {
                            borderColor = 'border-l-4 border-purple-500'
                            bgColor = 'bg-purple-500/5'
                            hoverBg = 'hover:bg-purple-500/15'
                          } else if (hasSuggestions) {
                            borderColor = 'border-l-4 border-yellow-500'
                            bgColor = 'bg-yellow-500/5'
                            hoverBg = 'hover:bg-yellow-500/15'
                          } else if (hasKeywords) {
                            borderColor = 'border-l-4 border-blue-500'
                            bgColor = 'bg-blue-500/5'
                            hoverBg = 'hover:bg-blue-500/15'
                          }
                          
                          return (
                            <div key={lIdx} className="relative group">
                              <div
                                onClick={() => {
                                  if (!isEmpty) {
                                    setActiveLineIndex(isActive ? null : globalIdx)
                                    setActiveSuggestionId(null)
                                  }
                                }}
                                className={`py-1.5 pr-16 pl-3 rounded-r transition-all relative ${
                                  isEmpty 
                                    ? 'h-3' 
                                    : isActive
                                    ? 'bg-indigo-500/20 border-l-4 border-indigo-500 cursor-pointer shadow-md'
                                    : hasAnyContent
                                    ? `${borderColor} ${bgColor} ${hoverBg} cursor-pointer`
                                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50 cursor-pointer border-l-2 border-transparent'
                                }`}
                              >
                                <span className={`whitespace-pre-wrap break-words block ${
                                  isActive 
                                    ? 'text-[#0f0f18] dark:text-white font-medium' 
                                    : 'text-[#555566] dark:text-neutral-400'
                                }`}>
                                  {line.text || '\u00A0'}
                                </span>
                                
                                {hasAnyContent && !isEmpty && (
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    {hasSuggestions && (
                                      <div className="relative">
                                        <span className="absolute inset-0 animate-ping bg-yellow-500 rounded-full opacity-20"></span>
                                        <div className="relative bg-yellow-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                          </svg>
                                          {suggestions.length}
                                        </div>
                                      </div>
                                    )}
                                    {hasKeywords && (
                                      <div className="relative">
                                        <span className="absolute inset-0 animate-ping bg-blue-500 rounded-full opacity-20"></span>
                                        <div className="relative bg-blue-500 text-white rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg flex items-center gap-1">
                                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                          </svg>
                                          {relevantKeywords.length}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {hasAnyContent && !isEmpty && !isActive && (
                                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                                                transition-opacity pointer-events-none whitespace-nowrap z-10">
                                    <div className="bg-[#0f0f18] dark:bg-white text-white dark:text-[#0f0f18] 
                                                  px-2 py-1 rounded text-[10px] font-medium shadow-lg">
                                      Click to see {hasSuggestions && hasKeywords ? 'suggestions & keywords' : hasSuggestions ? 'suggestions' : 'keywords'}
                                    </div>
                                  </div>
                                )}
                              </div>
                              
                              {isActive && (hasSuggestions || hasKeywords) && (
                                <div className="mt-2 ml-4 space-y-2 animate-fadeUp">
                                  {suggestions.map((suggestion) => (
                                    <div
                                      key={suggestion.id}
                                      className="bg-white dark:bg-[#1a1a2e] border-2 border-yellow-500/40 rounded-lg p-3 shadow-xl"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                          <div className="bg-yellow-500 text-white rounded-full p-1">
                                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                            </svg>
                                          </div>
                                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                            suggestion.section === 'Summary' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                                            suggestion.section === 'Experience' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                            suggestion.section === 'Skills' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                            'bg-green-500/10 text-green-400 border border-green-500/20'
                                          }`}>
                                            {suggestion.section}
                                          </span>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            copyToClipboard(suggestion.after)
                                          }}
                                          className="text-[#a0a0b8] dark:text-neutral-600 hover:text-brand-accent 
                                                   transition-colors hover:scale-110"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                          </svg>
                                        </button>
                                      </div>
                                      
                                      <div className="space-y-2 text-xs">
                                        <div className="bg-red-500/10 border border-red-500/30 rounded p-2.5">
                                          <p className="text-[#8888a0] dark:text-neutral-400 line-through">
                                            {suggestion.before}
                                          </p>
                                        </div>
                                        <div className="flex justify-center">
                                          <div className="bg-neutral-200 dark:bg-neutral-700 rounded-full p-1">
                                            <svg className="w-3 h-3 text-[#555566] dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                            </svg>
                                          </div>
                                        </div>
                                        <div className="bg-green-500/10 border border-green-500/30 rounded p-2.5">
                                          <p className="text-[#0f0f18] dark:text-white font-medium">
                                            {suggestion.after}
                                          </p>
                                        </div>
                                        <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded p-2 mt-2">
                                          <p className="text-[#8888a0] dark:text-neutral-500 text-xs italic">
                                            💡 {suggestion.reason}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {hasKeywords && (
                                    <div className="bg-white dark:bg-[#1a1a2e] border-2 border-blue-500/40 rounded-lg p-3 shadow-xl">
                                      <div className="flex items-center gap-2 mb-2">
                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                                          </svg>
                                        </div>
                                        <span className="text-xs font-bold text-blue-400">Relevant Keywords</span>
                                        <span className="bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                                          {relevantKeywords.length}
                                        </span>
                                      </div>
                                      <p className="text-[#8888a0] dark:text-neutral-400 text-xs mb-2.5">
                                        💡 Consider adding these if they match your actual experience:
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {relevantKeywords.map((keyword, idx) => (
                                          <button
                                            key={idx}
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              copyToClipboard(keyword)
                                            }}
                                            className="bg-blue-500/15 border-2 border-blue-500/40 text-blue-400 
                                                     rounded-full px-2.5 py-1 text-xs font-medium hover:bg-blue-500/25 
                                                     hover:scale-105 transition-all cursor-pointer shadow-sm"
                                          >
                                            {keyword}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div 
                ref={rightPanelRef}
                className="w-full lg:w-[60%] overflow-y-auto p-6 border-b lg:border-b-0 border-[#e2e2ea] dark:border-brand-border"
                style={{ maxHeight: '600px' }}
              >
                <div className="mb-4 pb-3 border-b border-[#e2e2ea] dark:border-brand-border">
                  <h3 className="text-[#0f0f18] dark:text-white font-semibold text-base">AI Suggestions</h3>
                  <p className="text-[#8888a0] dark:text-neutral-500 text-xs mt-1">
                    <span className="lg:hidden">Scroll down to see your resume with highlighted lines</span>
                    <span className="hidden lg:inline">Click suggestions or resume lines with badges to see details</span>
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-[#8888a0] dark:text-neutral-600 text-xs uppercase tracking-wider mb-2">
                    MISSING KEYWORDS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {tailoredResult.missingKeywords?.slice(0, 12).map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => copyToClipboard(keyword)}
                        className="bg-[#f0f0f6] dark:bg-neutral-800 border border-[#e2e2ea] dark:border-neutral-700 
                                 text-[#555566] dark:text-neutral-300 rounded-full px-3 py-1 text-xs
                                 hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400
                                 transition-all cursor-pointer"
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {tailoredResult.improvements?.map((imp, idx) => {
                    const isHighlighted = activeSuggestionId === idx
                    
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActiveSuggestionId(isHighlighted ? null : idx)
                          setActiveLineIndex(null)
                        }}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          isHighlighted
                            ? 'border-indigo-500 bg-indigo-500/5 shadow-lg'
                            : 'border-[#e2e2ea] dark:border-brand-border hover:border-[#c8c8d8] dark:hover:border-brand-borderHover hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            imp.section === 'Summary' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
                            imp.section === 'Experience' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            imp.section === 'Skills' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                            'bg-green-500/10 text-green-400 border border-green-500/20'
                          }`}>
                            {imp.section}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              copyToClipboard(imp.after)
                            }}
                            className="text-[#a0a0b8] dark:text-neutral-600 hover:text-brand-accent transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-2">
                            <p className="text-[#8888a0] dark:text-neutral-400 text-xs line-through">
                              {imp.before}
                            </p>
                          </div>
                          <div className="flex justify-center">
                            <svg className="w-4 h-4 text-[#a0a0b8] dark:text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                          </div>
                          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-2">
                            <p className="text-[#0f0f18] dark:text-white text-xs">
                              {imp.after}
                            </p>
                          </div>
                        </div>

                        <p className="text-[#8888a0] dark:text-neutral-500 text-xs italic mt-2">
                          {imp.reason}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 
                        dark:from-amber-500/5 dark:via-orange-500/5 dark:to-amber-500/5 
                        border border-amber-500/20 dark:border-amber-500/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h4 className="text-[#0f0f18] dark:text-white font-semibold text-sm mb-1">
                  Important: Use AI Suggestions Mindfully
                </h4>
                <p className="text-[#555566] dark:text-neutral-400 text-xs leading-relaxed">
                  These are AI-generated suggestions based on the job description. Only add keywords and make changes that accurately reflect your actual experience and skills. 
                  Adding irrelevant keywords or false information can hurt your credibility during interviews. Use these suggestions as inspiration, not as a template to copy blindly.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
