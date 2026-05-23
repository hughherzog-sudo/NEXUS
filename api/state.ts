const UPSTREAM_STATE_URL = 'http://198.199.87.20:8000/state'

interface VercelRequest {
  method?: string
}

interface VercelResponse {
  status: (code: number) => VercelResponse
  setHeader: (name: string, value: string) => void
  send: (body: string) => void
  json: (body: unknown) => void
  end: () => void
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.status(204).end()
    return
  }

  try {
    const upstream = await fetch(UPSTREAM_STATE_URL)
    const body = await upstream.text()

    res.setHeader(
      'content-type',
      upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
    )
    res.status(upstream.status).send(body)
  } catch (error) {
    res.status(502).json({
      error: 'Failed to fetch upstream NEXUS state',
      detail: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
