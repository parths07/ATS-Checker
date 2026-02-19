# Resume Analyzer - Implementation Tasks

## 1. Project Setup and Configuration
- [ ] 1.1 Initialize Next.js 16 project with Pages Router
- [ ] 1.2 Install dependencies (react-dropzone, pdf-parse, mammoth, tailwindcss)
- [ ] 1.3 Configure TailwindCSS (tailwind.config.js, postcss.config.js)
- [ ] 1.4 Create .env.local with GEMINI_API_KEY and GEMINI_MODEL
- [ ] 1.5 Create globals.css with Tailwind imports
- [ ] 1.6 Verify no /app folder exists

## 2. Core Pages Setup
- [ ] 2.1 Create /pages/_app.js with globals.css import
- [ ] 2.2 Create /pages/_document.js with custom HTML structure
- [ ] 2.3 Create /pages/index.js with basic layout structure

## 3. Utility Libraries
- [ ] 3.1 Create /lib/textCleaner.js with cleanText function
- [ ] 3.2 Create /lib/gemini.js with callGemini function using fetch()
- [ ] 3.3 Create /lib/scoreCalculator.js with calculateOverallScore function

## 4. UI Components - Basic
- [ ] 4.1 Create /components/LoadingSpinner.js
- [ ] 4.2 Create /components/Toast.js with auto-dismiss and manual close

## 5. UI Components - Upload and Input
- [ ] 5.1 Create /components/ResumeUpload.js with react-dropzone
- [ ] 5.2 Create /components/JobDescInput.js with textarea

## 6. UI Components - Results Display
- [ ] 6.1 Create /components/ScoreDisplay.js with color-coded score
- [ ] 6.2 Create /components/BreakdownCard.js with category breakdown
- [ ] 6.3 Create /components/SuggestionList.js with numbered list

## 7. API Routes - File Extraction
- [ ] 7.1 Create /pages/api/extract.js endpoint
- [ ] 7.2 Implement PDF parsing with pdf-parse
- [ ] 7.3 Implement DOCX parsing with mammoth
- [ ] 7.4 Add file validation and error handling

## 8. API Routes - Analysis
- [ ] 8.1 Create /pages/api/analyze.js endpoint
- [ ] 8.2 Implement Gemini API integration with fetch()
- [ ] 8.3 Create structured prompt for resume analysis
- [ ] 8.4 Parse and validate Gemini JSON response
- [ ] 8.5 Add error handling for API failures

## 9. Main Page Integration
- [ ] 9.1 Integrate ResumeUpload component in index.js
- [ ] 9.2 Integrate JobDescInput component in index.js
- [ ] 9.3 Add Analyze button with validation
- [ ] 9.4 Implement analysis API call with loading state
- [ ] 9.5 Integrate ScoreDisplay, BreakdownCard, SuggestionList components
- [ ] 9.6 Add Toast notifications for success/error states

## 10. Styling and Polish
- [ ] 10.1 Style main page layout with TailwindCSS
- [ ] 10.2 Add responsive design for mobile/tablet
- [ ] 10.3 Add hover states and transitions
- [ ] 10.4 Ensure consistent spacing and typography

## 11. Testing and Validation
- [ ] 11.1 Test PDF file upload and extraction
- [ ] 11.2 Test DOCX file upload and extraction
- [ ] 11.3 Test invalid file type handling
- [ ] 11.4 Test analysis with valid inputs
- [ ] 11.5 Test error scenarios (missing API key, network errors)
- [ ] 11.6 Test loading states and toast notifications
- [ ] 11.7 Verify no TypeScript files exist
- [ ] 11.8 Verify no /app folder exists
