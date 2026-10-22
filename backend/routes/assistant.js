// ============================================================
// backend/routes/assistant.js
// AI Scheme Assistant — Groq cha FREE API vaparto (Llama 3.3 model).
// FIX v2: Context compact keli (token limit sathi), ani error
// handling improve keli (server crash honar nahi ata).
// ============================================================

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Text la ठराविक शब्दांपर्यंत कापण्यासाठी helper (context size kami karण्यासाठी)
const truncate = (text, wordLimit) => {
  if (!text) return 'N/A';
  const words = text.toString().split(' ');
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
};

router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ message: 'Please type a question!' });
  }

  // ===== Step 1: Database मधून सगळे schemes ghe (context sathi) =====
  db.query('SELECT * FROM schemes ORDER BY name', async (err, schemes) => {
    // Database error - crash na hota properly response pathav
    if (err) {
      console.error('Assistant DB error:', err);
      return res.status(500).json({ message: 'Server error while fetching schemes' });
    }

    try {
      // ===== COMPACT context — ekach line prati scheme (token save karण्यासाठी) =====
      const schemesContext = schemes.map((s, i) =>
        `${i + 1}. ${s.name} [${s.category}] | Age:${s.min_age || 0}-${s.max_age || 'any'} | Income≤₹${s.max_income || 'no limit'} | ${s.gender}/${s.state}/${s.caste || 'All'}/${s.occupation || 'All'} | Benefit: ${truncate(s.benefits, 12)}`
      ).join('\n');

      const systemPrompt = `You are an AI Assistant for "National Scheme Portal" - a Government of India schemes eligibility portal.

Here is the complete list of available schemes (answer ONLY from this data):

${schemesContext}

STRICT RULES:
- ALWAYS reply in ENGLISH ONLY. Never use Hindi, Marathi, or any other language. (Voice output requires English)
- Only use the scheme data provided above — never invent or hallucinate information
- Suggest relevant schemes based on user's query, mention eligibility clearly
- Keep replies short, friendly, and easy to understand
- If answer is not in the data, say so clearly`;

      // ===== Step 2: Conversation history compact ठेव (फक्त शेवटची 4 messages) =====
      const trimmedHistory = (history || []).slice(-4).map(h => ({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: truncate(h.content, 60) // जुने messages पण truncate kar
      }));

      const messages = [
        { role: 'system', content: systemPrompt },
        ...trimmedHistory,
        { role: 'user', content: message }
      ];

      // ===== Step 3: Groq API call kar =====
      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 350,
        temperature: 0.5
      });

      const aiReply = response.choices[0]?.message?.content || 'Sorry, kahi answer nahi milala. Punha try kara.';
      res.json({ reply: aiReply });

    } catch (apiError) {
      // Groq API error (rate limit, network, etc.) - crash na hota response pathav
      console.error('Groq API Error:', apiError?.message || apiError);

      if (apiError?.error?.error?.code === 'rate_limit_exceeded') {
        return res.status(429).json({ message: 'Khup requests zale! 1 minute थांबून परत try kara. 🙏' });
      }

      res.status(500).json({ message: 'AI Assistant सध्या उपलब्ध नाही, थोड्या वेळाने प्रयत्न करा!' });
    }
  });
});

module.exports = router;