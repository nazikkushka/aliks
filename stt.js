const speech = require('@google-cloud/speech');
const fs = require('fs');
const client = new speech.SpeechClient();

module.exports = async function transcribe(filename) {
  const audio = {
    content: fs.readFileSync(filename).toString('base64'),
  };

  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'uk-UA',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results.map(r => r.alternatives[0].transcript).join('\n');
  return transcription;
};
