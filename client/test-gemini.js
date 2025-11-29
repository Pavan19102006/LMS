const apiKey = 'AIzaSyDKjmYszOuVwuJIp_U71I8nyVqT9IP4_0I';
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

const requestBody = {
  contents: [{
    parts: [{ text: "Hello, are you working?" }]
  }],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 1000
  }
};

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(requestBody)
})
.then(res => res.json())
.then(data => {
  console.log('✅ Gemini API Response:', JSON.stringify(data, null, 2));
})
.catch(err => {
  console.error('❌ Gemini API Error:', err.message);
});
