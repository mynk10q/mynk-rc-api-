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

    const status = upstreamRes.status;
    const contentType = upstreamRes.headers.get("content-type") || "application/json";
    const bodyText = await upstreamRes.text();

    // Add credit headers
    res.setHeader("X-API-BY", "MYNK");
    res.setHeader("X-CONTACT", "@mynk_mynk_mynk");

    res.status(status);
    res.setHeader("Content-Type", contentType);
    res.send(bodyText);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", detail: err.toString() });
  }
}
