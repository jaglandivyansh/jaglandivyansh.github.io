// api/doubt.js
// ─────────────────────────────────────────────────────────────────
// DYNAMIC TUTOR VERSION — SCALES LENGTH BASED ON QUESTION COMPLEXITY
// ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // 1. Basic Request Validation
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { question } = req.body;
  if (!question || question.trim() === "") return res.status(400).json({ error: "Question is required." });

  // 2. Environment Variable Validation
  if (!process.env.SARVAM_API_KEY) {
    return res.status(500).json({ answer: "⚠️ Server configuration error: SARVAM_API_KEY is missing." });
  }

  const SYSTEM_PROMPT = `You are an expert tutor for Indian competitive exams (UPSC, SSC, State PCS). 
  
  CRITICAL RESPONSE RULES:
  1. ADAPTIVE LENGTH: If the question requires a simple factual answer (e.g., "What is the capital of India?"), provide a brief, direct answer without filler.
  2. DETAILED ANSWERS: If the question asks for a definition (like "What is the Preamble?"), explanation, or process, provide a clear, engaging breakdown. Keep it under 200 words, use bullet points, **bold text** for keywords, and relevant emojis.
  3. NO MONOLOGUES: Never output internal reasoning, planning steps, or introductory filler like "Here is the answer". Provide only the final output.`;

  try {
    // 3. Timeout Protection (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-105b", // Ensure this exact model ID exists in Sarvam documentation
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question.trim() }
        ],
        temperature: 0.5,
        max_tokens: 1500 
      }),
      signal: controller.signal // Attaches the timeout
    });

    clearTimeout(timeoutId); // Clear timeout if fetch succeeds in time
    const data = await sarvamRes.json();
    
    // Server log for backup
    console.log("Sarvam API Response:", JSON.stringify(data, null, 2));

    // 4. Robust Error Handling for HTTP Status Codes
    if (!sarvamRes.ok) {
        const errorMsg = data?.message || data?.error?.message || data?.detail || JSON.stringify(data);
        return res.status(200).json({ answer: `⚠️ API Error (${sarvamRes.status}): ${errorMsg}` });
    }

    // 5. Broad Extraction Logic (Catches multiple possible JSON structures)
    let answer = data?.choices?.[0]?.message?.content || 
                 data?.text || 
                 data?.answer || 
                 data?.output || 
                 "";
    
    if (answer) {
      return res.status(200).json({ answer: answer.trim() });
    }

    // 6. Frontend Debugging: Push the raw JSON to the UI if text is missing
    return res.status(200).json({ 
        answer: `⚠️ Unrecognized response format. Raw data: ${JSON.stringify(data)}` 
    });

  } catch (err) {
    // Handle the specific timeout error gracefully
    if (err.name === 'AbortError') {
        return res.status(200).json({ answer: "⚠️ Request timed out. The AI took too long to respond." });
    }
    
    console.error("Backend Error:", err);
    return res.status(200).json({ answer: `⚠️ Backend Error: ${err.message}` });
  }
}
