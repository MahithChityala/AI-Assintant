import React, { useState } from 'react'
import axios from 'axios'
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
        console.log('Sending problem data to backend...');
        // Send problem data to backend for AI hint generation
        const backendResponse = await axios.post('http://localhost:3000/api/gemini', {
          title: response.problemData.title,
          description: response.problemData.description,
          platform: response.problemData.platform
        });
        
        console.log('Backend response:', backendResponse.data);
        
        if (backendResponse.data.success && backendResponse.data.hint) {
          setHint(backendResponse.data.hint);
        } else {
          setError('Failed to generate hint from backend.');
        }
      } else {
        setError('Could not extract problem data from this page. Make sure you are on a LeetCode or GeeksForGeeks problem page.')
      }
    } catch (err) {
      console.error('Error in getHint:', err);
      if (err.message.includes('Receiving end does not exist')) {
        setError('Content script not found. Please refresh the page and try again.')
      } else if (err.code === 'ECONNREFUSED') {
        setError('Backend server is not running. Please start the backend server on port 3000.')
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
      <p>Get AI-powered hints for your current DSA problem</p>
      
      <button 
        onClick={getHint} 
        disabled={loading}
        className="hint-button"
      >
        {loading ? 'Generating Hint...' : 'Get AI Hint'}
      </button>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {hint && (
        <div className="hint-container">
          <h3>AI-Generated Hint:</h3>
          <div className="hint-content">{hint}</div>
        </div>
      )}
    </div>
  )
}

export default Popup 