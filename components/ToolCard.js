import { useState, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'

export default function ToolCard({ onAnalyze, isLoading, resetTrigger, apiError }) {
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState('')
  const dropzoneRef = useRef(null)

  // Reset internal state when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      setResumeFile(null)
      setResumeText('')
      setJobDescription('')
      setError('')
      setExtracting(false)
    }
  }, [resetTrigger])

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return

    setExtracting(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setResumeFile({ name: file.name, charCount: data.charCount })
        setResumeText(data.text)
      } else {
        setError(data.error || 'Failed to extract text')
      }
    } catch (err) {
      setError('Error uploading file')
    } finally {
      setExtracting(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 5242880,
    disabled: isLoading || extracting
  })

  const handleAnalyze = () => {
    if (resumeText && jobDescription) {
      onAnalyze(resumeText, jobDescription, resumeFile?.name || '')
    }
  }

  const wordCount = jobDescription.trim().split(/\s+/).filter(Boolean).length
  const canAnalyze = resumeText && wordCount >= 20 && !isLoading && !extracting
  const charCount = jobDescription.length

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <div className="bg-white dark:bg-brand-card border border-[#e2e2ea] dark:border-brand-border rounded-2xl overflow-hidden">
        {/* Body */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left: Resume Upload */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#0f0f18] dark:text-white font-semibold text-base md:text-lg">Resume</span>
                <span className="text-xs text-[#8888a0] dark:text-neutral-500 bg-[#f0f0f6] dark:bg-neutral-800 rounded px-2 py-0.5">
                  PDF or DOCX
                </span>
              </div>

              {extracting ? (
                <div className="h-[220px] flex flex-col items-center justify-center bg-[#f0f0f6] dark:bg-[#0e0e16] border-2 border-dashed border-[#e2e2ea] dark:border-brand-border rounded-xl">
                  <svg className="animate-spin h-10 w-10 text-brand-accent" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <p className="mt-3 text-[#555566] dark:text-neutral-400 text-sm">Extracting text...</p>
                </div>
              ) : resumeFile ? (
                <div className="h-[220px] flex flex-col items-center justify-center bg-[#f0f0f6] dark:bg-[#0e0e16] border-2 border-green-500/40 rounded-xl p-6">
                  <svg className="w-10 h-10 text-green-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#0f0f18] dark:text-white font-medium text-center truncate max-w-xs">{resumeFile.name}</p>
                  <p className="text-green-400 text-sm mt-1">Extracted {resumeFile.charCount.toLocaleString()} characters</p>
                  <div className="w-full bg-green-500/20 h-1 rounded-full mt-3">
                    <div className="bg-green-500 h-1 rounded-full w-full" />
                  </div>
                  <button
                    onClick={() => {
                      setResumeFile(null)
                      setResumeText('')
                    }}
                    className="text-brand-accent text-xs underline mt-3 hover:text-brand-accentHover"
                  >
                    Change file ×
                  </button>
                </div>
              ) : (
                <div
                  ref={dropzoneRef}
                  {...getRootProps()}
                  className={`h-[220px] flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-brand-accent bg-brand-accentGlow'
                      : 'border-[#c8c8d8] dark:border-[#2a2a3e] bg-[#f0f0f6] dark:bg-[#0e0e16] hover:border-brand-accent/60 hover:bg-brand-accentGlow'
                  }`}
                >
                  <input {...getInputProps()} />
                  <svg className="w-9 h-9 text-brand-accent mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-[#0f0f18] dark:text-white font-medium">Drop your resume here</p>
                  <p className="text-[#8888a0] dark:text-neutral-500 text-sm mt-1">or click to select file</p>
                  <p className="text-[#a0a0b8] dark:text-neutral-600 text-xs mt-2">PDF, DOCX up to 5MB</p>
                </div>
              )}

              {error && (
                <p className="text-red-400 text-xs mt-2">{error}</p>
              )}
            </div>

            {/* Right: Job Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#0f0f18] dark:text-white font-semibold text-base md:text-lg">Job Description</span>
                <span className="text-[#8888a0] dark:text-neutral-500 text-xs md:text-sm">Paste from any job board</span>
              </div>

              <div className="relative">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  className="w-full h-[220px] bg-[#f0f0f6] dark:bg-[#0e0e16] 
                           border border-[#c8c8d8] dark:border-[#2a2a3e] rounded-xl p-4 
                           text-[#0f0f18] dark:text-neutral-200 
                           placeholder-[#a0a0b8] dark:placeholder-neutral-600 
                           text-sm leading-relaxed resize-none 
                           focus:border-brand-accent/60 focus:outline-none transition-colors"
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between mt-2 text-xs text-[#a0a0b8] dark:text-neutral-600">
                  <span>{wordCount} words</span>
                  <div className="flex items-center gap-3">
                    <span>{charCount} / 10,000</span>
                    {jobDescription && (
                      <button
                        onClick={() => setJobDescription('')}
                        className="text-[#a0a0b8] dark:text-neutral-600 hover:text-[#0f0f18] dark:hover:text-white transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
                {jobDescription.length > 0 && wordCount < 20 && (
                  <p className="text-yellow-500/70 text-xs mt-1">
                    Please paste a complete job description (min 20 words)
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e2e2ea] dark:border-brand-border px-6 md:px-8 py-4 md:py-5">
          {/* Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm flex-1">{apiError}</p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#a0a0b8] dark:text-neutral-600 text-xs">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data is never stored</span>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className={`w-full sm:w-auto h-12 px-8 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
                canAnalyze
                  ? 'bg-brand-accent hover:bg-brand-accentHover text-white hover:scale-[1.01]'
                  : 'bg-[#e2e2ea] dark:bg-neutral-800 text-[#a0a0b8] dark:text-neutral-600 cursor-not-allowed'
              }`}
              style={canAnalyze ? { boxShadow: '0 4px 16px rgba(91,110,245,0.2)' } : {}}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
