require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const stt = require('./utils/stt');

const app = express();
app.use(express.json());

app.post('/gpt-reply', async (req, res) => {
  const { prompt } = req.body;
  try {
    const gptResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });
    res.json({ reply: gptResponse.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'OpenAI error', details: error.message });
  }
});

app.post('/tts', async (req, res) => {
  const { text } = req.body;
  try {
    const audio = await axios.post(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
      text,
      voice_settings: { stability: 0.5, similarity_boost: 0.5 }
    }, {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    });
    res.set('Content-Type', 'audio/mpeg');
    res.send(audio.data);
  } catch (error) {
    res.status(500).json({ error: 'ElevenLabs error', details: error.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('AI Assistant is running on port 3000');
});
