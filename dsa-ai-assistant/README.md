# DSA AI Assistant

A Chrome extension that helps users solve DSA (Data Structures and Algorithms) problems on platforms like LeetCode and GeeksforGeeks by providing AI-powered hints and guidance without revealing full solutions.

## 🎯 Features

- **🔍 Auto-read DSA problems** - Extracts problem title and description from supported platforms
- **✨ AI-based hint generation** - Uses Google's Gemini Pro AI to generate intelligent hints
- **⚡ Clean popup UI** - Modern, user-friendly interface
- **🔁 Real-time interaction** - Seamless communication between popup and content script
- **🌐 Multi-site support** - Works on LeetCode, GeeksforGeeks, and more

## 🏗️ Architecture

```
Frontend (Chrome Extension) ←→ Backend (Express + Gemini API)
     ↓
Content Script (Extracts problem data)
```

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Chrome Extension Manifest v3
- **Backend**: Node.js + Express
- **AI**: Google Gemini Pro API
- **Styling**: Custom CSS (Grep UI was not available)

## 📁 Project Structure

```
dsa-ai-assistant/
├── frontend/
│   ├── src/
│   │   ├── popup.jsx           # Main UI component
│   │   ├── content.js          # Extracts problem content from page
│   │   ├── App.jsx             # Root component
│   │   └── popup.css           # Styles for popup
│   ├── manifest.json           # Chrome extension config
│   ├── vite.config.js          # Vite + CRX plugin config
│   └── package.json
├── backend/
│   ├── server.js               # Express server with Gemini integration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Chrome browser
- Google Gemini API key (for Phase 3)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dsa-ai-assistant
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # In backend/.env (create this file)
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

### Development

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Build the Chrome extension**
   ```bash
   cd frontend
   npm run build:extension
   ```

3. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `frontend/dist` folder

### Usage

1. Navigate to a DSA problem on LeetCode or GeeksforGeeks
2. Click the DSA AI Assistant extension icon
3. Click "Get Hint" to receive AI-generated guidance

## 📋 Implementation Phases

### ✅ Phase 1: Project Setup & Scaffolding
- [x] Project structure setup
- [x] Frontend: Vite + React + Chrome extension setup
- [x] Backend: Express server setup
- [x] Basic popup UI
- [x] Content script for data extraction
- [x] Chrome extension manifest

### 🔄 Phase 2: Content Script & Messaging
- [ ] Enhanced content script for better data extraction
- [ ] Improved messaging between popup and content script
- [ ] Error handling and validation

### 🔄 Phase 3: Backend Integration & AI Hint Generation
- [ ] Gemini API integration
- [ ] AI prompt engineering for better hints
- [ ] Frontend-backend communication

### 🔄 Phase 4: UI/UX Polish & Multi-site Support
- [ ] Enhanced UI design
- [ ] Support for additional platforms
- [ ] Loading states and error handling

### 🔄 Phase 5: Security, Testing, and Deployment
- [ ] Security improvements
- [ ] Testing suite
- [ ] Chrome Web Store preparation

## 🔐 Security

- API keys are stored securely in environment variables
- Communication between content script and popup uses Chrome's secure messaging API
- Only educational hints are provided, not full solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini Pro API for AI capabilities
- LeetCode and GeeksforGeeks for providing DSA problems
- Chrome Extension development community 