import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const tokenParam = searchParams.get('token') || ''
  const headerToken = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') || ''
  const token = tokenParam || headerToken
  const expected = process.env.REVALIDATE_TOKEN || ''

  if (!expected || token !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const tag = searchParams.get('tag') || 'blog-posts'
  revalidateTag(tag, { expire: 0 })
  return NextResponse.json({ ok: true, tag })
}