let tokenData = {}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Only GET allowed.' })
    return
  }

   async function fetchToken() {
    const responseEl = document.getElementById('response');
    try {
      const res = await fetch('https://tapkey.vercel.app/api/onetime');
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      return dta
    } catch (e) {
      return ""
    }
  }
  fetchToken();
  
  const { appid, voiceid, mode } = req.query

  if (!token) {
    res.status(400).json({ error: 'Missing token parameter.' })
    return
  }

  if (mode === 'set') {
    if (!appid || !voiceid) {
      res.status(400).json({ error: 'Missing appid or voiceid for set mode.' })
      return
    }
    tokenData[token] = { appid, voiceid }
    res.status(200).json({ success: true })
    return
  }

  if (mode === 'get') {
    const data = tokenData[token]
    if (!data) {
      res.status(404).json({ error: 'Token not found.' })
      return
    }
    res.status(200).json(data)
    return
  }

  res.status(400).json({ error: 'Missing or invalid mode parameter. Use mode=set or mode=get.' })
}
