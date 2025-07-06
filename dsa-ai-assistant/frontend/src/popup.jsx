import React, { useState } from 'react'
import './popup.css'

function Popup() {
  const [hint, setHint] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const getHint = async () => {
    setLoading(true)
    setError('')
    setHint('')

    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      // Send message to content script to extract problem data
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemData' })
      
      if (response && response.problemData) {
        // For now, just display the extracted data
        setHint(`Problem Title: ${response.problemData.title}\n\nProblem Description: ${response.problemData.description}`)
      } else {
        setError('Could not extract problem data from this page.')
      }
    } catch (err) {
      setError('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="popup-container">
      <h1>DSA AI Assistant</h1>
      <p>Get hints for your current DSA problem</p>
      
      <button 
        onClick={getHint} 
        disabled={loading}
        className="hint-button"
      >
        {loading ? 'Getting Hint...' : 'Get Hint'}
      </button>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {hint && (
        <div className="hint-container">
          <h3>Problem Information:</h3>
          <pre>{hint}</pre>
        </div>
      )}
    </div>
  )
}

export default Popup 