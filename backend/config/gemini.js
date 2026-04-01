const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

const generateContent = async (prompt) => {
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    throw new Error(`Gemini API error: ${error.message}`);
  }
};

const parseJSON = (text) => {
  try {
    // Remove markdown code blocks if present
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error("Failed to parse AI response as JSON");
  }
};

module.exports = { generateContent, parseJSON };