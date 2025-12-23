// agents/llmAgent.js
const genai = require('@google/genai');
require('dotenv').config();

// VALID KEY
if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env');
}

// KHỞI TẠO CLIENT
const client = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });


const MODEL = 'gemini-2.5-flash'; 

exports.generateContent = async (prompt) => {
  try {
    
    const result = await client.models.generateContent({
      model: MODEL,
      contents: prompt
    });

  
    return result.text;

  } catch (error) {
    console.error('Google GenAI Error:', error.response?.data || error.message);
    throw new Error('Không gọi được Google GenAI API');
  }
};
