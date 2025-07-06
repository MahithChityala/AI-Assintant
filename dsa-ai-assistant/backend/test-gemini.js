require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    console.log('Please add your API key to the .env file:');
    console.log('GEMINI_API_KEY=your-actual-api-key-here');
    return;
  }

  console.log('🔑 API Key found:', apiKey.substring(0, 10) + '...');
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Test with gemini-2.0-flash (the model from the curl example)
    console.log('🧪 Testing with gemini-2.0-flash...');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = 'Explain how AI works in a few words';
    console.log('📝 Prompt:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Success! Response:');
    console.log(text);
    
  } catch (error) {
    console.error('❌ Error testing Gemini API:');
    console.error(error.message);
    
    if (error.message.includes('404')) {
      console.log('\n💡 Try using a different model. Available models:');
      console.log('- gemini-1.5-flash');
      console.log('- gemini-1.5-pro');
      console.log('- gemini-pro');
    }
  }
}

testGeminiAPI(); 