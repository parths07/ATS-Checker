export default function Hero() {
  return (
    <div className="pt-12 md:pt-20 pb-12 md:pb-16 text-center relative">
      {/* Background Glow */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(91,110,245,0.06)_0%,transparent_70%)] 
                   dark:bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(91,110,245,0.12)_0%,transparent_70%)]"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 border border-[#c8c8d8] dark:border-brand-borderHover 
                        bg-[rgba(91,110,245,0.04)] dark:bg-[rgba(91,110,245,0.08)] 
                        rounded-full px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[#555566] dark:text-neutral-300 text-xs md:text-sm">AI-Powered ATS Scanner</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
          <div className="text-[#0f0f18] dark:text-white">Score Your Resume</div>
          <div className="text-[#0f0f18] dark:text-white">Against Any Job</div>
          <div className="text-brand-accent inline-block relative">
            Description
            <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
              <path d="M0 4 Q50 0, 100 4 T200 4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.4"/>
            </svg>
          </div>
        </h1>

        {/* Subtext */}
        <p className="text-[#555566] dark:text-neutral-400 text-base md:text-lg max-w-2xl mx-auto mt-4 md:mt-6 leading-relaxed px-4">
          Upload your resume, paste a job description, and get an instant ATS score with AI-powered suggestions to improve your chances.
        </p>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 md:mt-8 
                        text-[#8888a0] dark:text-neutral-500 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>100% Free</span>
          </div>
          <span className="hidden sm:inline text-[#c8c8d8] dark:text-neutral-700">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Results in ~3 seconds</span>
          </div>
          <span className="hidden sm:inline text-[#c8c8d8] dark:text-neutral-700">•</span>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>No signup required</span>
          </div>
        </div>
      </div>
    </div>
  )
}
