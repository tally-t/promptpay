export default async function handler(req, res) {
  const { number, amount } = req.query;

  if (!number) {
    return res.status(400).json({ error: 'Missing number' });
  }

  const url = amount
    ? `https://promptpay.io/${number}/${amount}.png`
    : `https://promptpay.io/${number}.png`;

  try {
    const upstream = await fetch(url);
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: 'QR fetch failed' });
    }

    const buffer = await upstream.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=60');
    res.send(Buffer.from(buffer));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
