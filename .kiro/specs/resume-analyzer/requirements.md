# Resume Analyzer - Requirements

## Overview
A Next.js 16 application that analyzes resumes against job descriptions using Google Gemini API, providing match scores and improvement suggestions.

## Technical Constraints
- Next.js 16 with Pages Router ONLY (no App Router, no /app folder)
- Plain JavaScript only (no TypeScript, no .ts/.tsx files)
- TailwindCSS only for styling (no component libraries)
- Google Gemini API using fetch() only (no SDK, no @google/generative-ai package)
- No database
- No authentication
- Single session only

## User Stories

### 1. Project Setup
As a developer, I want a properly configured Next.js 16 project with Pages Router so that I can build the application with the correct architecture.

**Acceptance Criteria:**
- 1.1 Next.js 16 is installed with Pages Router configuration
- 1.2 All pages are in /pages folder (index.js, _document.js, _app.js)
- 1.3 No /app folder exists
- 1.4 Project uses plain JavaScript only (no .ts or .tsx files)
- 1.5 TailwindCSS is installed and configured
- 1.6 Required packages are installed: react-dropzone, pdf-parse, mammoth
- 1.7 .env.local file is created with GEMINI_API_KEY and GEMINI_MODEL variables

### 2. File Upload
As a user, I want to upload my resume in PDF or DOCX format so that it can be analyzed.

**Acceptance Criteria:**
- 2.1 ResumeUpload component accepts PDF and DOCX files
- 2.2 File upload uses react-dropzone for drag-and-drop functionality
- 2.3 Uploaded file is validated for correct format
- 2.4 File content is extracted and displayed to user
- 2.5 User sees loading state during file processing
- 2.6 Error messages are shown for invalid files

### 3. Job Description Input
As a user, I want to input a job description so that my resume can be compared against it.

**Acceptance Criteria:**
- 3.1 JobDescInput component provides a textarea for job description
- 3.2 Input accepts plain text job descriptions
- 3.3 User can clear and re-enter job description
- 3.4 Character count or validation is shown if needed

### 4. Resume Analysis
As a user, I want my resume analyzed against the job description so that I can see how well they match.

**Acceptance Criteria:**
- 4.1 API endpoint /api/analyze.js receives resume text and job description
- 4.2 Text is cleaned and prepared using textCleaner.js utility
- 4.3 Gemini API is called using fetch() with proper prompt
- 4.4 API returns match score (0-100) and breakdown
- 4.5 API returns improvement suggestions
- 4.6 Error handling for API failures

### 5. Score Display
As a user, I want to see my match score prominently so that I understand how well my resume fits the job.

**Acceptance Criteria:**
- 5.1 ScoreDisplay component shows match score (0-100)
- 5.2 Score is visually represented (color-coded or progress bar)
- 5.3 Score updates when new analysis is performed

### 6. Breakdown Display
As a user, I want to see a detailed breakdown of the analysis so that I understand specific strengths and weaknesses.

**Acceptance Criteria:**
- 6.1 BreakdownCard component displays analysis categories
- 6.2 Each category shows relevant information from Gemini response
- 6.3 Breakdown is clearly organized and readable

### 7. Suggestions Display
As a user, I want to see actionable suggestions so that I can improve my resume.

**Acceptance Criteria:**
- 7.1 SuggestionList component displays improvement suggestions
- 7.2 Suggestions are presented as a clear list
- 7.3 Each suggestion is actionable and specific

### 8. User Feedback
As a user, I want visual feedback during processing so that I know the application is working.

**Acceptance Criteria:**
- 8.1 LoadingSpinner component shows during API calls
- 8.2 Toast component displays success/error messages
- 8.3 UI is responsive and provides clear status updates

## Folder Structure
```
/pages
  index.js
  _document.js
  _app.js
  /api
    analyze.js
    extract.js
/components
  ResumeUpload.js
  JobDescInput.js
  ScoreDisplay.js
  BreakdownCard.js
  SuggestionList.js
  LoadingSpinner.js
  Toast.js
/lib
  gemini.js
  textCleaner.js
  scoreCalculator.js
/styles
  globals.css
```

## Environment Variables
```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## Dependencies
- next@16
- react
- react-dom
- tailwindcss
- react-dropzone
- pdf-parse
- mammoth

## Out of Scope
- Database storage
- User authentication
- Multi-session support
- Resume history
- Export functionality (unless explicitly requested later)
