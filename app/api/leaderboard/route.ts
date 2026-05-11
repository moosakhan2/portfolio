import { kv } from '@vercel/kv'
import { NextResponse } from 'next/server'

interface Entry { name: string; score: number }

const KEY = 'mk_runner_lb'
const MAX = 10  // store top 10, UI shows top 5

export async function GET() {
  try {
    const lb = (await kv.get<Entry[]>(KEY)) ?? []
    return NextResponse.json(lb)
  } catch {
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name  = String(body.name  ?? '').trim().slice(0, 12)
    const score = Number(body.score)

    if (!name || !Number.isInteger(score) || score < 0) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 })
    }

    const lb = (await kv.get<Entry[]>(KEY)) ?? []
    const idx = lb.findIndex(e => e.name === name)

    if (idx >= 0) {
      if (score <= lb[idx].score) return NextResponse.json(lb)  // no improvement
      lb[idx].score = score
    } else {
      lb.push({ name, score })
    }

    lb.sort((a, b) => b.score - a.score)
    const trimmed = lb.slice(0, MAX)
    await kv.set(KEY, trimmed)
    return NextResponse.json(trimmed)
  } catch {
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
