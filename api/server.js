let pendingTokens = {}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.status(204).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Only GET requests allowed.' })
    return
  }

  const { mode, token, room } = req.query

  if (!mode) {
    res.status(400).json({ error: 'Missing "mode" parameter.' })
    return
  }

  if (mode === 'create') {
    if (!token || !room) {
      res.status(400).json({ error: 'Missing "token" or "room" parameter for create.' })
      return
    }
    pendingTokens[token] = { room, claimed: false }
    res.status(200).json({ success: true })
    return
  }

  if (mode === 'claim') {
    if (!token) {
      res.status(400).json({ error: 'Missing "token" parameter for claim.' })
      return
    }
    const data = pendingTokens[token]
    if (!data) {
      res.status(404).json({ error: 'Invalid token.' })
      return
    }
    if (data.claimed) {
      res.status(403).json({ error: 'Token already used.' })
      return
    }
    data.claimed = true
    res.status(200).json({ room: data.room })
    return
  }

  res.status(400).json({ error: 'Cannot process your request.' })
}
