const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let gemini = null;
if (GEMINI_API_KEY) {
  gemini = new GoogleGenerativeAI(GEMINI_API_KEY);
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'DSA AI Assistant Backend is running!' })
})

// Placeholder endpoint for Gemini API
app.post('/api/gemini', async (req, res) => {
  try {
    const { title, description, platform } = req.body
    
    if (!title || !description) {
      return res.status(400).json({ 
        error: 'Problem title and description are required' 
      })
    }

    // Use Gemini API if available
    if (gemini) {
      try {
        // Use the working model from your test: gemini-2.0-flash
        const model = gemini.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const prompt = `You are an expert DSA tutor. Given the following problem, provide a helpful hint (not a solution) to guide the student:\n\nTitle: ${title}\nPlatform: ${platform}\nDescription: ${description}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const hint = response.text();
        return res.json({ hint, success: true });
      } catch (aiError) {
        console.error('Gemini API error:', aiError);
        return res.status(500).json({ error: 'Failed to get hint from Gemini API', message: aiError.message });
      }
    }

    // Fallback: Placeholder response
    const placeholderHint = `Here's a helpful hint for \"${title}\" from ${platform}:\n\nThis is a placeholder hint. In Phase 3, this will be replaced with actual AI-generated hints from Google's Gemini Pro API.\n\nProblem: ${title}\nDescription: ${description.substring(0, 200)}...`

    res.json({ 
      hint: placeholderHint,
      success: true 
    })
    
  } catch (error) {
    console.error('Error in /api/gemini:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DSA AI Assistant Backend running on port ${PORT}`)
  console.log(`📝 API endpoint: http://localhost:${PORT}/api/gemini`)
}) 