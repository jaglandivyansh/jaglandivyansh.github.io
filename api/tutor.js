export default async function handler(req, res) {
  try {
    const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.SARVAM_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "sarvam-105b", 
        messages: req.body.messages,
        temperature: 0.2,
        max_tokens: 300 // <-- Isko 150 se 300 kar diya taaki jawab aadha na kate
      })
    });

    const data = await sarvamRes.json();

    // 💡 Agar Sarvam API koi error return kare (jaise API key galat ho)
    if (data.error) {
      return res.status(200).json({ error: data.error.message || data.error });
    }

    // Sab sahi raha toh frontend ko data bhej do
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Backend failed to connect." });
  }
}
