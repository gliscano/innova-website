import { NextRequest, NextResponse } from 'next/server'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email } = body as Record<string, unknown>

  // Validation
  if (typeof name !== 'string' || name.trim().length === 0 || name.length > 100) {
    return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
  }
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const apiKey = process.env.MAILCHIMP_API_KEY
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX

  if (!apiKey || !audienceId || !serverPrefix) {
    console.error('[leads] Missing Mailchimp env vars')
    return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })
  }

  const credentials = Buffer.from(`anystring:${apiKey}`).toString('base64')
  const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${audienceId}/members`

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email.trim().toLowerCase(),
        status: 'subscribed',
        merge_fields: {
          FNAME: name.trim(),
        },
      }),
    })
  } catch (err) {
    console.error('[leads] Mailchimp fetch error:', err)
    return NextResponse.json({ error: 'Error al conectar con el servicio' }, { status: 502 })
  }

  // Member already exists — treat as success to avoid exposing subscriber info
  if (response.status === 400) {
    const data = await response.json().catch(() => ({})) as Record<string, unknown>
    if (data.title === 'Member Exists') {
      return NextResponse.json({ success: true })
    }
    console.error('[leads] Mailchimp 400:', data)
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 502 })
  }

  if (!response.ok) {
    console.error('[leads] Mailchimp error status:', response.status)
    return NextResponse.json({ error: 'Error al registrar el email' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
