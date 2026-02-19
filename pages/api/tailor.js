const { callAI } = require('../../lib/ai')

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const { resumeText, jobDescription } = req.body
  
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Both fields required' })
  }
  
  try {
    const prompt = `You are an expert resume coach and ATS optimization specialist.

Analyze this resume against the job description and provide tailoring recommendations.

Return ONLY this raw JSON. No markdown. No code blocks. Start with { end with }

{
  "keyQualifications": [
    {
      "qualification": "string — the requirement from job description",
      "status": "have" | "missing" | "partial",
      "evidence": "string — what in resume supports this (or empty if missing)"
    }
  ],
  "improvements": [
    {
      "section": "Summary" | "Experience" | "Skills" | "Education",
      "before": "string — current text from resume",
      "after": "string — improved version tailored to this job",
      "reason": "string — why this change helps"
    }
  ],
  "missingKeywords": ["keyword1", "keyword2", ...],
  "overallAdvice": "string — 2-3 sentences of overall tailoring advice"
}

Provide 3-5 keyQualifications, 4-6 improvements, 8-15 missingKeywords.
Make improvements specific, realistic and directly based on the resume content.
The "before" text must be actual text from the resume.
The "after" text must be an improved rewrite of that text.

RESUME:
${resumeText.slice(0, 3000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 2000)}`
    
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
    
    return res.status(200).json(parsed)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
