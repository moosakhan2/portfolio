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
  const header = req.headers.get('Authorization')
  return header === `Bearer ${process.env.BLOG_PASSWORD}`
}

export async function GET() {
  const posts = readPosts()
  return NextResponse.json(posts.sort((a: { createdAt: string }, b: { createdAt: string }) =>
    b.createdAt.localeCompare(a.createdAt)
  ))
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { title, content, excerpt, category, tags } = body

  if (!title || !content || !category) {
    return new NextResponse('Missing required fields', { status: 400 })
  }

  const posts = readPosts()
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .concat('-', Date.now().toString(36))

  const post = {
    id,
    title,
    content,
    excerpt: excerpt ?? content.replace(/[#*`]/g, '').slice(0, 120),
    category,
    tags: tags ?? [],
    createdAt: new Date().toISOString(),
  }

  posts.push(post)
  writePosts(posts)

  return NextResponse.json(post, { status: 201 })
}
