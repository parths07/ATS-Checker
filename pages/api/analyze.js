const { callAI, buildCombinedPrompt } = require('../../lib/ai')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { resumeText, jobDescription } = req.body
  
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Both fields required' })
  }
  
  try {
    const prompt = buildCombinedPrompt(
      resumeText.slice(0, 3000),
      jobDescription.slice(0, 2000)
    )
    
    const raw = await callAI(prompt)
    
    function cleanJSON(raw) {
      if (!raw) throw new Error('Empty response from AI')
      const start = raw.indexOf('{')
      const end = raw.lastIndexOf('}')
      if (start === -1 || end === -1) {
        throw new Error('No valid JSON found in response')
      }
      return raw.slice(start, end + 1)
    }
    
    let parsed
    try {
      const cleanedRaw = cleanJSON(raw)
      parsed = JSON.parse(cleanedRaw)
    } catch (parseError) {
      throw new Error('Invalid JSON response from AI')
    }
    
    const keywordMatch = parsed.keywordMatch || {}
    const contextualMatch = parsed.contextualMatch || {}
    const textSimilarity = parsed.textSimilarity || {}
    const summary = parsed.summary || 'Analysis completed'
    const suggestions = parsed.suggestions || []
    
    const overallScore = Math.round(
      (keywordMatch.score || 0) * 0.20 +
      (contextualMatch.score || 0) * 0.50 +
      (textSimilarity.score || 0) * 0.30
    )
    
    return res.status(200).json({
      overallScore,
      keywordMatch,
      contextualMatch,
      textSimilarity,
      summary,
      suggestions
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
