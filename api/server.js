const pendingTokens = {}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const mode = searchParams.get('mode')
  const token = searchParams.get('token')
  const room = searchParams.get('room')

  if (mode === 'create' && token && room) {
    pendingTokens[token] = { room, claimed: false }
    return new Response(JSON.stringify({ success: true }))
  }

  if (mode === 'claim' && token) {
    const data = pendingTokens[token]
    if (!data) return new Response(JSON.stringify({ error: "Invalid token" }), { status: 404 })

    if (data.claimed) return new Response(JSON.stringify({ error: "Token already used" }), { status: 403 })

    data.claimed = true
    return new Response(JSON.stringify({ room: data.room }))
  }

  return new Response(JSON.stringify({ error: "Bad request" }), { status: 400 })
}
