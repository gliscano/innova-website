import { NextRequest, NextResponse } from 'next/server'
import { getCachedFolders } from '@/app/lib/cloudinaryFolders'

const RATE_LIMIT = 30
const WINDOW_MS = 60_000
const ipTimestamps = new Map<string, number[]>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS
  const timestamps = (ipTimestamps.get(ip) ?? []).filter(t => t > windowStart)
  if (timestamps.length >= RATE_LIMIT) return true
  timestamps.push(now)
  ipTimestamps.set(ip, timestamps)
  if (ipTimestamps.size > 5000) {
    for (const [key, ts] of ipTimestamps) {
      if (ts[ts.length - 1] < windowStart) ipTimestamps.delete(key)
    }
  }
  return false
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  try {
    const folders = await getCachedFolders()
    return NextResponse.json(
      { folders, total: folders.length },
      {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching Cloudinary folders:', error)
    return NextResponse.json({ error: 'Failed to fetch folders' }, { status: 500 })
  }
}
