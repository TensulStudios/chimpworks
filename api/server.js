import crypto from 'crypto'

let tokenStore = {}

function generateToken(length = 5) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateSecretToken() {
  return crypto.randomBytes(24).toString('hex')
}

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

  const { mode, appid, voiceid, token, secrettoken, roomlimit } = req.query

  if (mode === 'create') {
    if (!appid || !voiceid) {
      res.status(400).json({ error: 'Missing appid or voiceid.' })
      return
    }

    let joinToken
    do {
      joinToken = generateToken()
    } while (tokenStore[joinToken])

    if(!roomlimit) {
      roomlimit = 10
    }

    const secret = generateSecretToken()
    tokenStore[joinToken] = { appid, voiceid, secret, roomlimit }

    res.status(200).json({ token: joinToken, secretkey: secret })
    return
  }

  if (mode === 'get') {
    if (!token) {
      res.status(400).json({ error: 'Missing token.' })
      return
    }

    const data = tokenStore[token]
    if (!data) {
      res.status(404).json({ error: 'Token not found.' })
      return
    }

    res.status(200).json({ appid: data.appid, voiceid: data.voiceid, roomlimit: data.roomlimit })
    return
  }

  if (mode === 'delete') {
    if (!secrettoken) {
      res.status(400).json({ error: 'Missing secret token.' })
      return
    }

    const foundKey = Object.keys(tokenStore).find(k => tokenStore[k].secret === secrettoken)
    if (!foundKey) {
      res.status(404).json({ error: 'Invalid secret token.' })
      return
    }

    delete tokenStore[foundKey]
    res.status(200).json({ success: true })
    return
  }

  res.status(400).json({ error: 'Invalid mode.' })
}
