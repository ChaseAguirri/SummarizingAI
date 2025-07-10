import OpenAI from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

console.log('server.js loaded');
console.log('Server starting...');
console.log('API Key:', process.env.OPENAI_API_KEY || 'Not found');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/summarize', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', 
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant who summarizes text.',
        },
        {
          role: 'user',
          content: `Summarize the following text in 1–2 sentences:\n\n${text}`,
        },
      ],
      max_tokens: 150,
      temperature: 0.5,
    });

    const summary = completion.choices[0].message.content.trim();
    res.json({ summary });
  } catch (error) {
    console.error('❌ OpenAI error:', error);
    res.status(500).json({ error: 'Failed to summarize', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
