# Resume Analyzer - Design Document

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 16 (Pages Router)
- **Language**: JavaScript (no TypeScript)
- **Styling**: TailwindCSS
- **AI API**: Google Gemini API (fetch only, no SDK)
- **File Processing**: pdf-parse, mammoth
- **File Upload**: react-dropzone

### Application Flow
1. User uploads resume (PDF/DOCX) via drag-and-drop
2. File is sent to `/api/extract` endpoint for text extraction
3. User inputs job description in textarea
4. User clicks "Analyze" button
5. Resume text + job description sent to `/api/analyze` endpoint
6. Gemini API analyzes and returns structured response
7. Results displayed: score, breakdown, suggestions

## Component Design

### Pages

#### `/pages/index.js`
Main application page containing:
- ResumeUpload component
- JobDescInput component
- Analyze button
- ScoreDisplay component (conditional)
- BreakdownCard component (conditional)
- SuggestionList component (conditional)
- Toast notifications
- LoadingSpinner overlay

State management:
```javascript
const [resumeText, setResumeText] = useState('');
const [jobDesc, setJobDesc] = useState('');
const [analysis, setAnalysis] = useState(null);
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState({ show: false, message: '', type: '' });
```

#### `/pages/_app.js`
- Wraps application with TailwindCSS globals
- No additional providers needed (no auth, no context)

#### `/pages/_document.js`
- Custom HTML document structure
- Meta tags for responsive design

### API Routes

#### `/pages/api/extract.js`
**Purpose**: Extract text from uploaded PDF/DOCX files

**Input**: 
- FormData with file

**Process**:
1. Receive file from request
2. Validate file type (PDF or DOCX)
3. Use pdf-parse for PDF files
4. Use mammoth for DOCX files
5. Clean extracted text using textCleaner utility
6. Return cleaned text

**Output**:
```javascript
{
  success: true,
  text: "extracted resume text..."
}
```

**Error Handling**:
- Invalid file type
- File parsing errors
- Missing file

#### `/pages/api/analyze.js`
**Purpose**: Analyze resume against job description using Gemini API

**Input**:
```javascript
{
  resumeText: "string",
  jobDescription: "string"
}
```

**Process**:
1. Validate inputs (both fields required)
2. Clean text using textCleaner utility
3. Construct Gemini API prompt
4. Call Gemini API using fetch()
5. Parse JSON response from Gemini
6. Return structured analysis

**Gemini Prompt Structure**:
```
You are an expert resume analyzer. Analyze the following resume against the job description and provide a detailed assessment.

RESUME:
{resumeText}

JOB DESCRIPTION:
{jobDescription}

Provide your analysis in the following JSON format:
{
  "score": <number 0-100>,
  "breakdown": {
    "skills": { "match": <number 0-100>, "details": "string" },
    "experience": { "match": <number 0-100>, "details": "string" },
    "education": { "match": <number 0-100>, "details": "string" },
    "keywords": { "match": <number 0-100>, "details": "string" }
  },
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    ...
  ]
}
```

**Output**:
```javascript
{
  success: true,
  analysis: {
    score: 75,
    breakdown: { ... },
    suggestions: [ ... ]
  }
}
```

### Components

#### `ResumeUpload.js`
**Props**: 
- `onTextExtracted: (text) => void`
- `onError: (message) => void`

**Features**:
- Drag-and-drop zone using react-dropzone
- Accept only .pdf and .docx files
- Show file name after upload
- Loading state during extraction
- Clear/remove file button

**UI**:
- Dashed border dropzone
- Upload icon
- "Drag & drop or click to upload" text
- File type indicator (.pdf, .docx)
- Extracted text preview (first 200 chars)

#### `JobDescInput.js`
**Props**:
- `value: string`
- `onChange: (value) => void`

**Features**:
- Large textarea for job description
- Character count display
- Clear button
- Placeholder text

**UI**:
- Full-width textarea
- Min height: 200px
- Border styling with TailwindCSS
- Label: "Job Description"

#### `ScoreDisplay.js`
**Props**:
- `score: number` (0-100)

**Features**:
- Large score number display
- Color-coded based on score:
  - 0-49: Red
  - 50-74: Yellow
  - 75-100: Green
- Circular progress indicator or progress bar

**UI**:
- Centered large number
- Percentage symbol
- Color background or border
- Label: "Match Score"

#### `BreakdownCard.js`
**Props**:
- `breakdown: object` (skills, experience, education, keywords)

**Features**:
- Display each category with match percentage
- Show details for each category
- Visual indicators (progress bars or badges)

**UI**:
- Card layout with sections
- Each section: title, percentage, details
- Grid or stacked layout

#### `SuggestionList.js`
**Props**:
- `suggestions: array of strings`

**Features**:
- Numbered or bulleted list
- Each suggestion on separate line
- Clear, readable formatting

**UI**:
- Ordered list
- Each item with icon or bullet
- Proper spacing

#### `LoadingSpinner.js`
**Props**: None

**Features**:
- Animated spinner
- Overlay background
- Center of screen

**UI**:
- Full-screen overlay with semi-transparent background
- Centered spinner animation
- "Analyzing..." text

#### `Toast.js`
**Props**:
- `show: boolean`
- `message: string`
- `type: 'success' | 'error' | 'info'`
- `onClose: () => void`

**Features**:
- Auto-dismiss after 3 seconds
- Manual close button
- Color-coded by type

**UI**:
- Fixed position (top-right)
- Slide-in animation
- Icon based on type
- Close button (X)

### Utility Libraries

#### `/lib/gemini.js`
**Purpose**: Handle Gemini API communication

**Functions**:

```javascript
export async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    }
  );
  
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
```

#### `/lib/textCleaner.js`
**Purpose**: Clean and normalize text

**Functions**:

```javascript
export function cleanText(text) {
  // Remove extra whitespace
  // Remove special characters that might break parsing
  // Normalize line breaks
  // Trim
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, '\n')
    .trim();
}
```

#### `/lib/scoreCalculator.js`
**Purpose**: Calculate overall score from breakdown (if needed)

**Functions**:

```javascript
export function calculateOverallScore(breakdown) {
  const categories = Object.values(breakdown);
  const sum = categories.reduce((acc, cat) => acc + cat.match, 0);
  return Math.round(sum / categories.length);
}
```

## Styling with TailwindCSS

### Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
```

### Global Styles (`/styles/globals.css`)
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-gray-50;
}
```

## Error Handling

### Client-Side
- File upload errors: Show toast notification
- API errors: Show toast notification with error message
- Network errors: Show "Connection failed" message
- Invalid inputs: Disable analyze button, show validation messages

### Server-Side
- Missing API key: Return 500 with clear message
- Gemini API errors: Return 500 with error details
- File parsing errors: Return 400 with error message
- Invalid request body: Return 400 with validation errors

## Environment Variables

Required in `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

## Data Flow

1. **File Upload Flow**:
   ```
   User drops file → ResumeUpload → FormData → /api/extract → 
   pdf-parse/mammoth → textCleaner → return text → setResumeText
   ```

2. **Analysis Flow**:
   ```
   User clicks Analyze → POST /api/analyze → textCleaner → 
   Gemini API (fetch) → Parse JSON → return analysis → 
   setAnalysis → Display components
   ```

## Performance Considerations

- File size limit: 5MB for uploads
- API timeout: 30 seconds for Gemini calls
- Text preview: Show only first 200 characters
- No caching (single session requirement)

## Security Considerations

- API key stored in environment variables (server-side only)
- File type validation on both client and server
- Input sanitization before sending to Gemini
- No file storage (process and discard)
- CORS not needed (same-origin API routes)

## Testing Strategy

Manual testing checklist:
- [ ] Upload PDF resume
- [ ] Upload DOCX resume
- [ ] Upload invalid file type
- [ ] Enter job description
- [ ] Click analyze with both inputs
- [ ] Click analyze with missing inputs
- [ ] Verify score display
- [ ] Verify breakdown display
- [ ] Verify suggestions display
- [ ] Test error scenarios
- [ ] Test loading states
- [ ] Test toast notifications
