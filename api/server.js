let pendingTokens = {}

export default function handler(req, res) {
  const { mode, token, room } = req.query

  if (mode === 'create') {
    if (!token || !room) return res.status(400).json({ error: 'Missing token or room' })
    pendingTokens[token] = { room, claimed: false }
    return res.status(200).json({ success: true })
  }

  if (mode === 'claim') {
    if (!token) return res.status(400).json({ error: 'Missing token' })

    const data = pendingTokens[token]
    if (!data) return res.status(404).json({ error: 'Invalid token' })
    if (data.claimed) return res.status(403).json({ error: 'Token already used' })

    data.claimed = true
    return res.status(200).json({ room: data.room })
  }

  return res.status(400).json({ error: 'Unable to process request.' })
}
