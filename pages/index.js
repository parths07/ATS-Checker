import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ToolCard from '../components/ToolCard'
import TailorSection from '../components/TailorSection'
import ScoreBanner from '../components/ScoreBanner'
import BreakdownSection from '../components/BreakdownSection'
import Footer from '../components/Footer'
import ToastNotification from '../components/ToastNotification'

export default function Home({ theme, toggleTheme }) {
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [toast, setToast] = useState(null)
  const [resetTrigger, setResetTrigger] = useState(0)
  const [apiError, setApiError] = useState(null)
  const [currentResumeData, setCurrentResumeData] = useState(null)
  const resultsRef = useRef(null)

  useEffect(() => {
    if (analysisResult && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  }, [analysisResult])

  const handleAnalyze = async (resumeText, jobDescription, fileName) => {
    setIsLoading(true)
    setAnalysisResult(null)
    setApiError(null)
    
    setCurrentResumeData({ resumeText, jobDescription, fileName })

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription })
      })

      const data = await response.json()

      if (response.ok) {
        setAnalysisResult(data)
        setToast({ message: 'Analysis complete!', type: 'success' })
      } else {
        const errorMessage = data.error || 'Analysis failed'
        setApiError(errorMessage)
        setToast({ message: errorMessage, type: 'error' })
      }
    } catch (err) {
      const errorMessage = 'Something went wrong. Please try again.'
      setApiError(errorMessage)
      setToast({ message: errorMessage, type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }



  const handleReset = () => {
    setAnalysisResult(null)
    setIsLoading(false)
    setToast(null)
    setApiError(null)
    setCurrentResumeData(null)
    
    setResetTrigger(prev => prev + 1)
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Head>
        <title>ATS Check - Free AI Resume Scanner</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Free AI-powered ATS resume scanner. Get instant compatibility scores and improvement suggestions. No signup required." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-[#f5f5fa] dark:bg-[#0a0a0f]">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main>
          <Hero />
          
          <ToolCard 
            onAnalyze={handleAnalyze} 
            isLoading={isLoading} 
            resetTrigger={resetTrigger}
            apiError={apiError}
          />

          {analysisResult && (
            <div ref={resultsRef} className="mt-12 max-w-[1100px] mx-auto px-4 space-y-8 animate-fadeUp">
              <ScoreBanner 
                score={analysisResult.overallScore}
                summary={analysisResult.summary}
              />

              <BreakdownSection
                keywordMatch={analysisResult.keywordMatch}
                contextualMatch={analysisResult.contextualMatch}
                textSimilarity={analysisResult.textSimilarity}
              />

              <TailorSection 
                theme={theme}
                resumeData={currentResumeData}
              />

              <div className="text-center mt-12 mb-16">
                <p className="text-[#8888a0] dark:text-neutral-500 text-sm mb-4">
                  Not satisfied? Try with a different resume or job description.
                </p>
                <button
                  onClick={handleReset}
                  className="border border-[#e2e2ea] dark:border-neutral-700 
                           text-[#555566] dark:text-neutral-300 
                           hover:border-[#c8c8d8] dark:hover:border-neutral-500 
                           hover:text-[#0f0f18] dark:hover:text-white 
                           rounded-xl px-6 py-3 font-medium transition-all"
                >
                  Start Over
                </button>
              </div>
            </div>
          )}
        </main>

        <Footer />

        {/* Toast */}
        {toast && (
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </>
  )
}
