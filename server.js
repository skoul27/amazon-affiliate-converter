const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const AFFILIATE_TAG = "skoul27-21"; // 🔁 Replace with your affiliate tag

app.post('/convert', async (req, res) => {
  const { shortUrl } = req.body;
  if (!shortUrl) return res.status(400).json({ error: "Missing shortUrl" });

  try {
    const resolvedUrl = await axios.get(shortUrl, { maxRedirects: 0 }).catch(e => {
      const redirected = e.response.headers.location;
      return { data: null, redirectedUrl: redirected };
    });

    const finalUrl = resolvedUrl.redirectedUrl || resolvedUrl.request.res.responseUrl;
    if (!finalUrl.includes("amazon.")) return res.status(400).json({ error: "Invalid Amazon URL" });

    let updated = new URL(finalUrl);
    updated.searchParams.set("tag", AFFILIATE_TAG);

    res.json({ affiliateLink: updated.toString() });
  } catch (err) {
    res.status(500).json({ error: "Failed to process link" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
