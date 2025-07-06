const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

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

    // TODO: Integrate with Gemini API in Phase 3
    // For now, return a placeholder response
    const placeholderHint = `Here's a helpful hint for "${title}" from ${platform}:

This is a placeholder hint. In Phase 3, this will be replaced with actual AI-generated hints from Google's Gemini Pro API.

Problem: ${title}
Description: ${description.substring(0, 200)}...`

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