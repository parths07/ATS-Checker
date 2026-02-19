import formidable from 'formidable'
import fs from 'fs'
import pdf from 'pdf-parse'
import mammoth from 'mammoth'

function cleanText(text) {
  if (!text) return ''
  
  return text
    .replace(/\0/g, '')
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{4,}/g, '\n\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim()
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({ maxFileSize: 5 * 1024 * 1024 })
    
    const [, files] = await form.parse(req)
    const file = files.file?.[0]

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    if (file.size > 5 * 1024 * 1024) {
      fs.unlinkSync(file.filepath)
      return res.status(400).json({ error: 'File size exceeds 5MB limit' })
    }

    const fileName = file.originalFilename || file.newFilename
    const fileExt = fileName.toLowerCase().split('.').pop()
    let text = ''
    let fileType = ''

    if (fileExt === 'pdf') {
      fileType = 'pdf'
      const dataBuffer = fs.readFileSync(file.filepath)
      const data = await pdf(dataBuffer)
      text = data.text
    } else if (fileExt === 'docx') {
      fileType = 'docx'
      const result = await mammoth.extractRawText({ path: file.filepath })
      text = result.value
    } else {
      fs.unlinkSync(file.filepath)
      return res.status(400).json({ error: 'Only PDF and DOCX files are supported' })
    }

    fs.unlinkSync(file.filepath)

    const cleanedText = cleanText(text)

    if (cleanedText.length < 50) {
      return res.status(400).json({ error: 'Could not extract text from this file' })
    }

    return res.status(200).json({ 
      success: true, 
      text: cleanedText,
      fileType,
      charCount: cleanedText.length
    })
  } catch (error) {
    return res.status(500).json({ error: 'Failed to process file. Please try again.' })
  }
}
