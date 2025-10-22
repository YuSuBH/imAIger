# Playground Implementation Guide

## Overview

The Playground page (`/playGround`) integrates all four AI features (Generate, Analyze, Upscale, Remove BG) into a unified interface with intelligent prompt interpretation.

## Features Implemented

### 1. **AI-Powered Interpretation**

- New `/interpret` API endpoint that uses Gemini AI to understand user intent
- Automatically determines which action to perform based on natural language prompts
- Extracts parameters (upscale factor, format, etc.) from user descriptions

### 2. **Unified UI Layout**

#### Sidebar (Left)

- **Site Logo/Name** at the top
- **Configuration Panel**: Upscale settings (factor, format)
- **History Placeholder**: For future implementation

#### Main Content Area

- **Large Heading**: "Upload Image"
- **Two Side-by-Side Cards**:
  - Left: Original image preview
  - Right: Result image or analyzed text
- **Download Button**: Appears when result is ready
- **Error Display**: User-friendly error messages

#### Prompt Section (Bottom)

- **Dynamic Instructions**:
  - No image: "Describe the image you want to generate..."
  - Image uploaded: Shows three action buttons (Analyze, Upscale, Remove BG)
- **Prompt Input**: Large textarea with voice input support
- **Submit Button**: Executes the operation
- **Reset Button**: Clears all states

### 3. **Smart Submission Logic**

The submit button behavior follows these rules:

```
IF no image AND no prompt → disabled
IF only prompt → generate image
IF only image → analyze image
IF image + selected option → execute selected function directly
IF image + prompt →
  → Send to AI interpretation
  → AI determines action (analyze/upscale/remove-bg)
  → AI extracts parameters if applicable
  → Execute determined action
```

### 4. **Keyboard Shortcuts**

- `Ctrl + Enter` to submit from the textarea

## File Structure

```
server/src/routes/
  ├── interpret.js          # NEW: AI interpretation endpoint

web/app/playGround/
  └── page.tsx              # Main playground page

web/components/
  ├── Navbar.tsx            # Updated with playground link
  └── VoiceInput.tsx        # Reused voice input component
```

## API Endpoints Used

1. **POST /interpret** - New endpoint

   - Input: `{ prompt: string, hasImage: boolean }`
   - Output: `{ action, reasoning, parameters }`

2. **POST /generate** - Generate images
3. **POST /analyze** - Analyze images
4. **POST /upscale** - Upscale images
5. **POST /bgRemove** - Remove backgrounds

## How AI Interpretation Works

The `/interpret` endpoint uses Gemini 1.5 Flash to:

1. **Analyze Context**:

   - Check if user has uploaded an image
   - Parse the user's natural language prompt

2. **Determine Action**:

   - Identify keywords and intent
   - Select appropriate action (GENERATE/ANALYZE/UPSCALE/REMOVE_BG)

3. **Extract Parameters**:

   - For upscale: detect factor (2x, 4x, 6x, 8x) and format (JPG/PNG)
   - For analyze: extract specific query
   - For generate: use full prompt

4. **Validate**:
   - Ensure logical consistency (e.g., can't upscale without image)
   - Apply fallback rules

## Example Prompts

### Generation (no image)

- "A futuristic city at sunset"
- "Create a portrait of a cat wearing a crown"

### Analysis (with image)

- "What objects are in this image?"
- "Extract all text from this image"
- "Describe the scene"

### Upscale (with image)

- "Upscale this 4x in PNG format"
- "Make this image bigger, quadruple the size"
- "Enhance the resolution to 8x"

### Remove Background (with image)

- "Remove the background"
- "Make the background transparent"
- "Cut out the subject"

### Smart Interpretation (with image + prompt)

- "Make this look better" → AI interprets as upscale
- "Tell me what's in this picture" → AI interprets as analyze
- "I need this without the background" → AI interprets as remove BG

## Configuration

Ensure these environment variables are set:

```env
# Server (.env)
GEMINI_API_KEY=your_gemini_api_key
PORT=3001

# Web (.env.local)
NEXT_PUBLIC_API_BASE=http://localhost:3001/
```

## Running the Application

1. **Start the backend server**:

   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start the Next.js frontend**:

   ```bash
   cd web
   npm install
   npm run dev
   ```

3. **Navigate to**: http://localhost:3000/playGround

## User Experience Flow

1. User lands on playground page
2. Can upload an image OR start typing a prompt
3. If image uploaded, three option buttons appear
4. User can:
   - Select an option directly for quick action
   - Type a prompt for AI interpretation
   - Use voice input for hands-free operation
5. Click submit or press Ctrl+Enter
6. AI processes the request
7. Result appears in the right card
8. User can download the result or reset and start over

## Future Enhancements

- **History Feature**: Save and display previous operations
- **Batch Processing**: Handle multiple images at once
- **Real-time Preview**: Show progress during processing
- **Advanced Settings**: More granular control per feature
- **Prompt Templates**: Pre-defined prompts for common tasks
- **Image Comparison**: Side-by-side before/after slider
- **Export Options**: Multiple format and quality options

## React Best Practices Applied

1. **Component Modularity**: Reused VoiceInput component
2. **State Management**: Clear separation of concerns
3. **Error Handling**: Comprehensive try-catch with user feedback
4. **Loading States**: Visual feedback during async operations
5. **Accessibility**: Proper semantic HTML and keyboard shortcuts
6. **Type Safety**: TypeScript interfaces for API responses
7. **Clean Code**: Descriptive variable names and comments
8. **Responsive Design**: Mobile-friendly layout with Tailwind CSS

## Troubleshooting

### Issue: AI interpretation not working

- Check GEMINI_API_KEY is set correctly
- Verify the interpret route is registered in server.js
- Check server logs for detailed error messages

### Issue: Images not displaying

- Ensure NEXT_PUBLIC_API_BASE ends with a slash
- Check CORS is enabled on the backend
- Verify image URLs are accessible

### Issue: Voice input not working

- Voice input requires HTTPS or localhost
- Check browser compatibility (Chrome, Edge recommended)
- Ensure microphone permissions are granted
