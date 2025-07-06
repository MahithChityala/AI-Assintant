// Content script to extract DSA problem data from supported platforms

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getProblemData') {
    const problemData = extractProblemData()
    sendResponse({ problemData })
  }
})

function extractProblemData() {
  const url = window.location.href
  
  // Extract data based on the platform
  if (url.includes('leetcode.com')) {
    return extractLeetCodeData()
  } else if (url.includes('geeksforgeeks.org')) {
    return extractGeeksForGeeksData()
  } else {
    return null
  }
}

function extractLeetCodeData() {
  try {
    // Extract problem title
    const titleElement = document.querySelector('[data-cy="question-title"]') || 
                        document.querySelector('.mr-2.text-label-1') ||
                        document.querySelector('h1')
    
    const title = titleElement ? titleElement.textContent.trim() : 'Unknown Problem'

    // Extract problem description
    const descriptionElement = document.querySelector('[data-cy="question-content"]') ||
                              document.querySelector('.content__u3I1') ||
                              document.querySelector('.question-content__JfgR')
    
    let description = ''
    if (descriptionElement) {
      // Get text content while preserving some formatting
      description = descriptionElement.innerText || descriptionElement.textContent || ''
      description = description.trim()
      
      // Limit description length
      if (description.length > 1000) {
        description = description.substring(0, 1000) + '...'
      }
    }

    return {
      title,
      description,
      platform: 'LeetCode',
      url: window.location.href
    }
  } catch (error) {
    console.error('Error extracting LeetCode data:', error)
    return null
  }
}

function extractGeeksForGeeksData() {
  try {
    // Extract problem title
    const titleElement = document.querySelector('.problem-tab h1') ||
                        document.querySelector('.gfg-practice-problem-head h1') ||
                        document.querySelector('h1')
    
    const title = titleElement ? titleElement.textContent.trim() : 'Unknown Problem'

    // Extract problem description
    const descriptionElement = document.querySelector('.problem-tab .content') ||
                              document.querySelector('.gfg-practice-problem-content') ||
                              document.querySelector('.problem-description')
    
    let description = ''
    if (descriptionElement) {
      description = descriptionElement.innerText || descriptionElement.textContent || ''
      description = description.trim()
      
      // Limit description length
      if (description.length > 1000) {
        description = description.substring(0, 1000) + '...'
      }
    }

    return {
      title,
      description,
      platform: 'GeeksForGeeks',
      url: window.location.href
    }
  } catch (error) {
    console.error('Error extracting GeeksForGeeks data:', error)
    return null
  }
}

// Log that content script is loaded
console.log('DSA AI Assistant content script loaded') 