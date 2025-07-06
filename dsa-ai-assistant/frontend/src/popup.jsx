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
      console.log('Getting active tab...');
      // Get the active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      console.log('Active tab:', tab);
      
      if (!tab) {
        setError('Could not get active tab information.')
        return
      }

      // Check if we're on a supported site
      const url = tab.url || '';
      console.log('Current URL:', url);
      
      if (!url.includes('leetcode.com') && !url.includes('geeksforgeeks.org')) {
        setError('This extension only works on LeetCode and GeeksForGeeks problem pages.')
        return
      }
      
      console.log('Sending message to content script...');
      // Send message to content script to extract problem data
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProblemData' })
      console.log('Response from content script:', response);
      
      if (response && response.problemData) {
        // For now, just display the extracted data
        setHint(`Problem Title: ${response.problemData.title}\n\nProblem Description: ${response.problemData.description}`)
      } else {
        setError('Could not extract problem data from this page. Make sure you are on a LeetCode or GeeksForGeeks problem page.')
      }
    } catch (err) {
      console.error('Error in getHint:', err);
      if (err.message.includes('Receiving end does not exist')) {
        setError('Content script not found. Please refresh the page and try again.')
      } else {
        setError('Error: ' + err.message)
      }
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