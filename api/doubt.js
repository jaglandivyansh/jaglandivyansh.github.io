// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// DYNAMIC TUTOR VERSION — SCALES LENGTH BASED ON QUESTION COMPLEXITY
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // 🎯 Updated Prompt: Relaxed the strict constraints so the model doesn't freeze on medium-length answers.
  const SYSTEM_PROMPT = `You are an expert tutor for Indian competitive exams (UPSC, SSC, State PCS). 
  
  CRITICAL RESPONSE RULES:
  1. ADAPTIVE LENGTH: If the question requires a simple factual answer (e.g., "What is the capital of India?"), provide a brief, direct answer without filler.
  2. DETAILED ANSWERS: If the question asks for a definition (like "What is the Preamble?"), explanation, or process, provide a clear, engaging breakdown. Keep it under 200 words, use bullet points, **bold text** for keywords, and relevant emojis.
  3. NO MONOLOGUES: Never output internal reasoning, planning steps, or introductory filler like "Here is the answer". Provide only the final output.`;

  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-105b", // Verify this is the correct model ID in Sarvam's docs
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question.trim() }
        ],
        temperature: 0.5,
        max_tokens: 400 
      })
    });

    const data = await sarvamRes.json();
    
    // 🔍 SERVER-SIDE DEBUGGING: Check your terminal/Vercel logs to see the exact API response
    console.log("Sarvam API Response:", JSON.stringify(data, null, 2));

    // Handle standard HTTP errors that fetch doesn't throw on automatically
    if (!sarvamRes.ok) {
        return res.status(200).json({ answer: `⚠️ API Error (${sarvamRes.status}): ${data.message || data.detail || JSON.stringify(data)}` });
    }

    if (data.error) {
        return res.status(200).json({ answer: `⚠️ API Error: ${data.error.message || JSON.stringify(data.error)}` });
    }

    let answer = data?.choices?.[0]?.message?.content || "";
    
    if (answer) {
      return res.status(200).json({ answer: answer.trim() });
    }

    return res.status(200).json({ answer: "⚠️ Model did not return any text. Check server logs for the raw response." });

  } catch (err) {
    console.error("Backend Error:", err);
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
