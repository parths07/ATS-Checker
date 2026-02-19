const MODELS = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile',
  'llama3-70b-8192',
  'llama3-8b-8192',
]

async function callGroqModel(prompt, model) {
  const url = 'https://api.groq.com/openai/v1/chat/completions'
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2048
    })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    const errorMsg = data?.error?.message || 'Unknown error'
    throw new Error(errorMsg)
  }
  
  return data.choices[0].message.content
}

async function callAI(prompt) {
  let lastError = null
  
  for (const model of MODELS) {
    try {
      const result = await callGroqModel(prompt, model)
      return result
    } catch (err) {
      lastError = err
      
      const isRateLimit = err.message.includes('rate_limit') ||
                         err.message.includes('Rate limit') ||
                         err.message.includes('quota') ||
                         err.message.includes('exceeded') ||
                         err.message.includes('tokens per') ||
                         err.message.includes('429')
      
      if (isRateLimit) {
        await new Promise(resolve => setTimeout(resolve, 500))
        continue
      }
      
      continue
    }
  }
  
  throw new Error('All AI models are currently busy. Please try again in a minute.')
}

function buildCombinedPrompt(resumeText, jobDescription) {
  return `You are an expert ATS analyzer. Analyze the resume against the job description.

Return ONLY this raw JSON object. No markdown. No code blocks. No backticks. No explanation. Start your response with { and end with }

{
  "keywordMatch": {
    "score": <number 0-100>,
    "matchedSkills": [],
    "missingRequiredSkills": [],
    "analysis": "<2 sentences>"
  },
  "contextualMatch": {
    "score": <number 0-100>,
    "alignedAspects": [],
    "gaps": [],
    "analysis": "<2 sentences>"
  },
  "textSimilarity": {
    "score": <number 0-100>,
    "wellMatchedAreas": [],
    "poorlyMatchedAreas": [],
    "analysis": "<2 sentences>"
  },
  "summary": "<3 sentences>",
  "suggestions": [
    {
      "priority": <1-5>,
      "category": "<Skills|Experience|Language|Format|Keywords>",
      "suggestion": "<string>",
      "why": "<1 sentence>",
      "example": "<string>",
      "estimatedScoreImprovement": <1-10>
    }
  ]
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`
}

module.exports = { callAI, buildCombinedPrompt }
