// agents/llmAgent.js
const genai = require('@google/genai');
require('dotenv').config();

// VALID KEY
if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in .env');
}

// KHỞI TẠO CLIENT
const client = new genai.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// MODEL PHỔ BIẾN hiện tại mà SDK hỗ trợ (Gemini 2.5+)
const MODEL = 'gemini-2.5-flash'; // hoặc gemini-2.5-pro nếu bạn có quyền

exports.generateContent = async (prompt) => {
  try {
    // GỌI API generateContent chuẩn từ SDK
    const result = await client.models.generateContent({
      model: MODEL,
      contents: prompt
    });

    // TRẢ VỀ TEXT
    return result.text;

  } catch (error) {
    console.error('Google GenAI Error:', error.response?.data || error.message);
    throw new Error('Không gọi được Google GenAI API');
  }
};
