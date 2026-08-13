// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// DYNAMIC TUTOR VERSION — SCALES LENGTH BASED ON QUESTION COMPLEXITY
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // 🎯 Updated Prompt: Added conditional logic to handle short answers vs long explanations.
  const SYSTEM_PROMPT = `You are an expert tutor for Indian competitive exams (UPSC, SSC, State PCS). 
  
  CRITICAL RESPONSE RULES:
  1. ADAPTIVE LENGTH: If the question is a direct factual query with a simple 1-5 word answer (e.g., "What is the capital of India?", "Who wrote the Constitution?"), provide ONLY the exact short answer. NO extra words, NO emojis, NO bullet points, NO elaboration.
  2. DETAILED ANSWERS: ONLY if the question asks for an explanation, concept breakdown, or process, then you must be highly engaging. Use bullet points, **bold text** for keywords, and relevant emojis. Keep it under 200 words.
  3. NO MONOLOGUES: Never output internal reasoning, planning steps, or introductory filler like "Here is the answer". Provide only the final output.`;

  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-105b", 
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question.trim() }
        ],
        temperature: 0.5, // Lowered slightly from 0.5 to keep factual answers more grounded
        max_tokens: 400 
      })
    });

    const data = await sarvamRes.json();
    
    if (data.error) {
        return res.status(200).json({ answer: `⚠️ API Error: ${data.error.message || JSON.stringify(data.error)}` });
    }

    let answer = data?.choices?.[0]?.message?.content || "";
    
    if (answer) {
      return res.status(200).json({ answer: answer.trim() });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text." });

  } catch (err) {
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
