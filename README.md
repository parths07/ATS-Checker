# ATS Analyzer

An AI-powered resume analysis tool that helps you optimize your resume for Applicant Tracking Systems (ATS) and job descriptions.

## What It Does

ATS Analyzer uses Google's Gemini AI to analyze your resume against job descriptions and provides:

- **Overall Match Score** - Weighted score based on keyword matching, contextual relevance, and text similarity
- **Detailed Breakdown** - Analysis across three key dimensions:
  - Keyword Matching (20% weight) - Skills, tools, and frameworks
  - Contextual Matching (50% weight) - Experience relevance and role alignment
  - Text Similarity (30% weight) - Language and description alignment
- **Actionable Suggestions** - Prioritized recommendations to improve your resume with estimated score improvements
- **Privacy First** - Your resume is never stored and analysis is discarded immediately after completion

## Tech Stack

- **Framework**: Next.js 16 (Pages Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: TailwindCSS
- **AI**: Google Gemini API (fetch only, no SDK)
- **File Processing**: pdf-parse, mammoth
- **File Upload**: react-dropzone

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd resume-analyzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

### 4. Add your Gemini API key

Get your API key from [Google AI Studio](https://aistudio.google.com) and add it to `.env.local`:

```
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) in your browser.

## Usage

1. **Upload Resume** - Drag and drop or click to upload your resume (PDF or DOCX)
2. **Paste Job Description** - Copy and paste the full job description
3. **Analyze** - Click "Analyze Now" to get your results
4. **Review** - Check your match score, detailed breakdown, and improvement suggestions
5. **Improve** - Use the suggestions to optimize your resume

## Deploy to Vercel

### Option 1: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variables:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `GEMINI_MODEL` - `gemini-1.5-flash`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts and add your environment variables when asked.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key from AI Studio | Yes |
| `GEMINI_MODEL` | Gemini model to use (default: gemini-1.5-flash) | No |

## Features

- ✅ Dark theme UI with smooth animations
- ✅ Drag-and-drop file upload
- ✅ PDF and DOCX support
- ✅ Real-time character and word count
- ✅ Circular progress gauge with count-up animation
- ✅ Expandable breakdown cards
- ✅ Copy-to-clipboard for examples
- ✅ Toast notifications
- ✅ Error handling and retry logic
- ✅ Rate limit handling
- ✅ Mobile responsive

## Project Structure

```
/pages
  index.js              # Main application page
  _document.js          # Custom document with fonts
  _app.js              # App wrapper
  /api
    analyze.js         # Analysis endpoint
    extract.js         # File extraction endpoint
/components
  ResumeUpload.js      # File upload component
  JobDescInput.js      # Job description input
  ScoreDisplay.js      # Circular score gauge
  BreakdownCard.js     # Expandable breakdown card
  SuggestionList.js    # Improvement suggestions
  LoadingSpinner.js    # Loading indicator
  Toast.js            # Toast notifications
/lib
  gemini.js           # Gemini API integration
  textCleaner.js      # Text cleaning utilities
  scoreCalculator.js  # Score calculation utilities
/styles
  globals.css         # Global styles
```

## License

MIT
