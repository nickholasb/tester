const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'ai-url-safety-checker' });
});

function isLikelySuspiciousUrl(urlString) {
  const lower = urlString.toLowerCase();
  const suspiciousPatterns = [
    'bit.ly',
    'tinyurl',
    'goo.gl',
    't.co',
    'localhost',
    '127.0.0.1',
    'file://',
    'javascript:',
    'data:',
    'blob:',
    'login',
    'verify',
    'account',
    'update',
    'secure',
    'confirm',
    'suspicious'
  ];

  return suspiciousPatterns.some((pattern) => lower.includes(pattern));
}

async function inspectUrl(urlString) {
  const parsed = new URL(urlString);
  const result = {
    url: parsed.toString(),
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    pathname: parsed.pathname,
    searchParams: Object.fromEntries(parsed.searchParams.entries()),
    isHttps: parsed.protocol === 'https:',
    isSuspicious: isLikelySuspiciousUrl(parsed.hostname + parsed.pathname),
    redirectChain: [],
    status: 'pending'
  };

  try {
    const response = await fetch(urlString, {
      method: 'GET',
      redirect: 'manual',
      headers: {
        'User-Agent': 'AI-URL-Safety-Checker/1.0'
      }
    });

    result.status = response.status;
    result.redirectChain.push({
      status: response.status,
      location: response.headers.get('location') || null,
      url: response.url || urlString
    });

    let nextUrl = response.headers.get('location');
    let count = 0;

    while (nextUrl && count < 5) {
      const nextLocation = new URL(nextUrl, urlString).toString();
      result.redirectChain.push({
        status: 'redirect',
        location: nextLocation,
        url: nextLocation
      });

      const redirectResponse = await fetch(nextLocation, {
        method: 'GET',
        redirect: 'manual',
        headers: {
          'User-Agent': 'AI-URL-Safety-Checker/1.0'
        }
      });

      nextUrl = redirectResponse.headers.get('location');
      count += 1;
      result.status = redirectResponse.status;
    }
  } catch (error) {
    result.error = error.message;
  }

  return result;
}

async function askGemini(urlData) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return 'AI analysis is disabled because GEMINI_API_KEY is not configured.';
  }

  const prompt = `
    You are a cautious cybersecurity reviewer.
    Analyze this URL and provide a short security summary.
    Focus on: suspicious shorteners, redirects, HTTP vs HTTPS, login prompts, and phishing signals.
    Be strict but concise.

    URL: ${urlData.url}
    Hostname: ${urlData.hostname}
    Status: ${urlData.status}
    Redirect count: ${urlData.redirectChain.length}
    Suspicious indicators: ${urlData.isSuspicious ? 'yes' : 'no'}
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      return `AI analysis unavailable: ${response.status} ${errorBody}`;
    }

    const payload = await response.json();
    const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('\n');

    return text || 'AI analysis returned no usable result.';
  } catch (error) {
    return `AI analysis error: ${error.message}`;
  }
}

app.post('/api/check-url', async (req, res) => {
  try {
    const { url } = req.body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid URL is required.' });
    }

    const safeUrl = url.trim();
    const parsed = new URL(safeUrl);

    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return res.status(400).json({ error: 'Only http and https URLs are allowed.' });
    }

    const urlData = await inspectUrl(safeUrl);
    const aiSummary = await askGemini(urlData);

    const risk =
      urlData.isSuspicious || !urlData.isHttps || urlData.redirectChain.length > 1
        ? 'High risk'
        : 'Low risk';

    res.json({
      risk,
      url: urlData.url,
      hostname: urlData.hostname,
      isHttps: urlData.isHttps,
      isSuspicious: urlData.isSuspicious,
      redirectCount: urlData.redirectChain.length,
      redirectChain: urlData.redirectChain,
      aiSummary
    });
  } catch (error) {
    res.status(400).json({ error: `Invalid URL: ${error.message}` });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
