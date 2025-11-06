// /api/lookup.js
export default async function handler(req, res) {
  try {
    const { rc, key } = req.query;

    if (!key || key !== "mynkapi") {
      return res.status(401).json({ error: "Invalid or missing API key. Use ?key=mynkapi" });
    }
    if (!rc) {
      return res.status(400).json({ error: "Missing required parameter: rc" });
    }

    const upstreamUrl = `https://vvvin-ng.vercel.app/lookup?rc=${encodeURIComponent(rc)}`;
    const upstreamRes = await fetch(upstreamUrl);
    const text = await upstreamRes.text();

    let body;
    try {
      // try to parse JSON (some responses are raw text)
      body = JSON.parse(text);
    } catch {
      body = { raw: text };
    }

    // 🔽 add your credit tag here
    body.api_by = "MYNK";
    body.telegram = "@mynk_mynk_mynk";

    res.setHeader("Content-Type", "application/json");
    res.status(upstreamRes.status).json(body);

  } catch (err) {
    res.status(500).json({ error: "Internal server error", detail: err.toString() });
  }
}
