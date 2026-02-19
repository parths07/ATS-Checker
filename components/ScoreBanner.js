import { useEffect, useState } from 'react'

function getScoreColor(score) {
  if (score >= 90) return '#4ade80'
  if (score >= 80) return '#60a5fa'
  if (score >= 70) return '#facc15'
  if (score >= 60) return '#fb923c'
  return '#f87171'
}

function getScoreLabel(score) {
  if (score >= 90) return 'Excellent Match'
  if (score >= 80) return 'Strong Match'
  if (score >= 70) return 'Good Match'
  if (score >= 60) return 'Fair Match'
  return 'Needs Improvement'
}

export default function ScoreBanner({ score, summary }) {
  const [displayScore, setDisplayScore] = useState(0)
  const scoreColor = getScoreColor(score)
  const scoreLabel = getScoreLabel(score)

  useEffect(() => {
    let current = 0
    const increment = score / 60
    const timer = setInterval(() => {
      current += increment
      if (current >= score) {
        setDisplayScore(score)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.floor(current))
      }
    }, 20)

    return () => clearInterval(timer)
  }, [score])

  const circumference = 2 * Math.PI * 90
  const strokeDashoffset = circumference - (displayScore / 100) * circumference

  return (
    <div 
      className="rounded-2xl p-6 md:p-8 border border-[#e2e2ea] dark:border-[#2a1f45]
                 bg-[linear-gradient(135deg,#ffffff_0%,#f0eeff_100%)] 
                 dark:bg-[linear-gradient(135deg,#12121a_0%,#16102a_100%)]"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
        {/* Left Side */}
        <div className="flex-1 text-center lg:text-left w-full">
          <p className="text-[#8888a0] dark:text-neutral-400 text-xs md:text-sm uppercase tracking-widest font-medium mb-2">
            ATS Compatibility Score
          </p>
          <div className="text-6xl md:text-8xl font-black mt-2" style={{ color: scoreColor }}>
            {displayScore}
          </div>
          <div className="text-xl md:text-2xl font-semibold mt-2" style={{ color: scoreColor }}>
            {scoreLabel}
          </div>
          <p className="mt-4 text-[#555566] dark:text-neutral-300 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
            {summary}
          </p>
        </div>

        {/* Right Side - Circular Gauge */}
        <div className="flex-shrink-0">
          <svg width="160" height="160" viewBox="0 0 220 220" className="md:w-[220px] md:h-[220px]">
            {/* Background Circle */}
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke="#e2e2ea"
              className="dark:stroke-[#1f1f2e]"
              strokeWidth="14"
            />
            {/* Score Arc */}
            <circle
              cx="110"
              cy="110"
              r="90"
              fill="none"
              stroke={scoreColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 110 110)"
              style={{
                filter: `drop-shadow(0 0 8px ${scoreColor})`,
                transition: 'stroke-dashoffset 1.2s ease'
              }}
            />
            {/* Score Text */}
            <text
              x="110"
              y="100"
              textAnchor="middle"
              fill={scoreColor}
              fontSize="52"
              fontWeight="900"
              fontFamily="Inter"
            >
              {displayScore}
            </text>
            <text
              x="110"
              y="130"
              textAnchor="middle"
              fill="#8888a0"
              className="dark:fill-[#6b7280]"
              fontSize="14"
              fontFamily="Inter"
            >
              out of 100
            </text>
          </svg>
        </div>
      </div>
    </div>
  )
}
