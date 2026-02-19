import '../styles/globals.css'
import useTheme from '../hooks/useTheme'

export default function App({ Component, pageProps }) {
  const { theme, toggleTheme } = useTheme()
  
  return (
    <div className="font-sans">
      <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
    </div>
  )
}
