import { readFileSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import PostEditor from '@/components/blog/PostEditor'
import type { Post } from '@/components/blog/PostCard'

export default function EditPost({ params }: { params: { id: string } }) {
  let posts: Post[] = []
  try {
    posts = JSON.parse(readFileSync(join(process.cwd(), 'data/posts.json'), 'utf-8'))
  } catch {}

  const post = posts.find((p) => p.id === params.id)
  if (!post) notFound()

  return <PostEditor existing={post} />
}
