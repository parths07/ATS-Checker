import { useState, useEffect } from 'react'

export default function useTheme() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // On mount, read saved preference from localStorage
    const saved = localStorage.getItem('theme')
    if (saved) {
      setTheme(saved)
      document.documentElement.classList.toggle('dark', saved === 'dark')
    } else {
      // Default to dark
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return { theme, toggleTheme }
}
