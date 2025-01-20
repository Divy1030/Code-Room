import { generateResult } from '../services/ai.service.js';

export const getResult = async (req, res) => {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }
    const result = await generateResult(prompt);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getResult:", error);
    
   }
};