// Content script to extract DSA problem data from supported platforms

// Debug: Alert to confirm content script is loaded
alert('DSA AI Assistant content script loaded!');

// Debug: Log to console
console.log('DSA AI Assistant content script loaded on:', window.location.href);

// Test function to help debug DOM structure
window.debugDSAExtraction = function() {
  console.log('=== DSA AI Assistant Debug Mode ===');
  console.log('Current URL:', window.location.href);
  
  // Log all h1 elements
  console.log('All H1 elements:');
  document.querySelectorAll('h1').forEach((el, i) => {
    console.log(`${i + 1}. Text: "${el.textContent.trim()}" | Classes: "${el.className}"`);
  });
  
  // Log elements with 'title' in class
  console.log('Elements with "title" in class:');
  document.querySelectorAll('[class*="title"]').forEach((el, i) => {
    console.log(`${i + 1}. Tag: ${el.tagName} | Classes: "${el.className}" | Text: "${el.textContent.trim().substring(0, 50)}"`);
  });
  
  // Log elements with 'description' or 'content' in class
  console.log('Elements with "description" or "content" in class:');
  document.querySelectorAll('[class*="description"], [class*="content"]').forEach((el, i) => {
    console.log(`${i + 1}. Tag: ${el.tagName} | Classes: "${el.className}" | Text: "${el.textContent.trim().substring(0, 100)}"`);
  });
  
  // Try to extract data
  console.log('Attempting extraction...');
  const data = extractProblemData();
  console.log('Extraction result:', data);
  
  return data;
};

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'getProblemData') {
    console.log('Extracting problem data...');
    
    // For LeetCode, we need to wait for dynamic content
    if (window.location.href.includes('leetcode.com')) {
      extractLeetCodeDataWithWait().then(problemData => {
        console.log('Extracted data:', problemData);
        sendResponse({ problemData });
      });
      return true; // Keep the message channel open for async response
    } else {
      const problemData = extractProblemData();
      console.log('Extracted data:', problemData);
      sendResponse({ problemData });
    }
  }
});

function extractProblemData() {
  const url = window.location.href;
  console.log('Extracting from URL:', url);
  
  // Extract data based on the platform
  if (url.includes('leetcode.com')) {
    return extractLeetCodeData();
  } else if (url.includes('geeksforgeeks.org')) {
    return extractGeeksForGeeksData();
  } else {
    console.log('Unsupported platform:', url);
    return null;
  }
}

// Function to wait for LeetCode content to load
function extractLeetCodeDataWithWait() {
  return new Promise((resolve) => {
    const maxWaitTime = 5000; // 5 seconds max wait
    const checkInterval = 100; // Check every 100ms
    let elapsed = 0;
    
    const checkForContent = () => {
      const descriptionElement = document.querySelector('.elfjS[data-track-load="description_content"]');
      
      if (descriptionElement && descriptionElement.textContent.trim().length > 0) {
        console.log('Description content found after waiting:', elapsed, 'ms');
        resolve(extractLeetCodeData());
        return;
      }
      
      elapsed += checkInterval;
      if (elapsed >= maxWaitTime) {
        console.log('Timeout waiting for description content');
        resolve(extractLeetCodeData()); // Try anyway
        return;
      }
      
      setTimeout(checkForContent, checkInterval);
    };
    
    checkForContent();
  });
}

function extractLeetCodeData() {
  try {
    console.log('Extracting LeetCode data...');
    
    // Multiple selectors for title (LeetCode changes their DOM frequently)
    const titleSelectors = [
      '[data-cy="question-title"]',
      '.mr-2.text-label-1',
      'h1',
      '.text-title-large',
      '[data-testid="question-title"]',
      '.question-title',
      'h1[class*="title"]',
      '.problem-title',
      'a[href*="/problems/"]' // New selector based on the HTML structure you provided
    ];
    
    let titleElement = null;
    for (const selector of titleSelectors) {
      titleElement = document.querySelector(selector);
      if (titleElement) {
        console.log('Found title with selector:', selector);
        break;
      }
    }
    
    const title = titleElement ? titleElement.textContent.trim() : 'Unknown Problem';
    console.log('Found title:', title);

    // Primary selector for description based on the HTML structure you provided
    const descriptionElement = document.querySelector('.elfjS[data-track-load="description_content"]');
    
    let description = '';
    if (descriptionElement) {
      console.log('Found description element with .elfjS[data-track-load="description_content"]');
      
      // Get text content while preserving some formatting
      description = descriptionElement.innerText || descriptionElement.textContent || '';
      description = description.trim();
      
      console.log('Raw description length:', description.length);
      console.log('Description preview:', description.substring(0, 200));
      
      // Limit description length
      if (description.length > 1000) {
        description = description.substring(0, 1000) + '...';
      }
    } else {
      console.log('No description element found with .elfjS[data-track-load="description_content"]');
      
      // Fallback selectors
      const fallbackSelectors = [
        '[data-cy="question-content"]',
        '.content__u3I1',
        '.question-content__JfgR',
        '.description__24sA',
        '[data-testid="question-content"]',
        '.problem-description',
        '.content',
        '.description',
        '[class*="description"]',
        '[class*="content"]'
      ];
      
      let fallbackElement = null;
      for (const selector of fallbackSelectors) {
        fallbackElement = document.querySelector(selector);
        if (fallbackElement) {
          console.log('Found description with fallback selector:', selector);
          break;
        }
      }
      
      if (fallbackElement) {
        description = fallbackElement.innerText || fallbackElement.textContent || '';
        description = description.trim();
        
        if (description.length > 1000) {
          description = description.substring(0, 1000) + '...';
        }
      } else {
        console.log('No description element found with any selector');
        // Debug: Log all elements with 'description' or 'content' in their class
        document.querySelectorAll('*').forEach(el => {
          if (el.className && (el.className.includes('description') || el.className.includes('content'))) {
            console.log('Found element:', el.tagName, el.className, el.textContent.substring(0, 50));
          }
        });
      }
    }
    
    console.log('Final description length:', description.length);

    return {
      title,
      description,
      platform: 'LeetCode',
      url: window.location.href
    };
  } catch (error) {
    console.error('Error extracting LeetCode data:', error);
    return null;
  }
}

function extractGeeksForGeeksData() {
  try {
    console.log('Extracting GeeksForGeeks data...');
    
    // Multiple selectors for title
    const titleSelectors = [
      '.problem-tab h1',
      '.gfg-practice-problem-head h1',
      'h1',
      '.problem-title',
      '[class*="title"]',
      '.title'
    ];
    
    let titleElement = null;
    for (const selector of titleSelectors) {
      titleElement = document.querySelector(selector);
      if (titleElement) {
        console.log('Found title with selector:', selector);
        break;
      }
    }
    
    const title = titleElement ? titleElement.textContent.trim() : 'Unknown Problem'
    console.log('Found title:', title);

    // Multiple selectors for description
    const descriptionSelectors = [
      '.problem-tab .content',
      '.gfg-practice-problem-content',
      '.problem-description',
      '.content',
      '.description',
      '[class*="description"]',
      '[class*="content"]'
    ];
    
    let descriptionElement = null;
    for (const selector of descriptionSelectors) {
      descriptionElement = document.querySelector(selector);
      if (descriptionElement) {
        console.log('Found description with selector:', selector);
        break;
      }
    }
    
    let description = ''
    if (descriptionElement) {
      description = descriptionElement.innerText || descriptionElement.textContent || ''
      description = description.trim()
      
      // Limit description length
      if (description.length > 1000) {
        description = description.substring(0, 1000) + '...'
      }
    } else {
      console.log('No description element found. Available elements:');
      // Debug: Log all elements with 'description' or 'content' in their class
      document.querySelectorAll('*').forEach(el => {
        if (el.className && (el.className.includes('description') || el.className.includes('content'))) {
          console.log('Found element:', el.tagName, el.className, el.textContent.substring(0, 50));
        }
      });
    }
    
    console.log('Found description length:', description.length);

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