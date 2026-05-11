import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

const postsPath = join(process.cwd(), 'data', 'posts.json')

function readPosts() {
  try {
    return JSON.parse(readFileSync(postsPath, 'utf-8'))
  } catch {
    return []
  }
}

function writePosts(posts: unknown[]) {
  writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8')
}

function isAuthed(req: NextRequest) {
  return req.headers.get('Authorization') === `Bearer ${process.env.BLOG_PASSWORD}`
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const posts = readPosts()
  const post = posts.find((p: { id: string }) => p.id === params.id)
  if (!post) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(post)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return new NextResponse('Unauthorized', { status: 401 })

  const posts = readPosts()
  const idx = posts.findIndex((p: { id: string }) => p.id === params.id)
  if (idx === -1) return new NextResponse('Not found', { status: 404 })

  const body = await req.json()
  const { createdAt } = posts[idx]
  posts[idx] = { ...posts[idx], ...body, createdAt }
  writePosts(posts)

  return NextResponse.json(posts[idx])
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthed(req)) return new NextResponse('Unauthorized', { status: 401 })

  const posts = readPosts()
  const filtered = posts.filter((p: { id: string }) => p.id !== params.id)
  if (filtered.length === posts.length) return new NextResponse('Not found', { status: 404 })

  writePosts(filtered)
  return new NextResponse(null, { status: 204 })
}
