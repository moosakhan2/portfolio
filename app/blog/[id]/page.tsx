import { readFileSync } from 'fs'
import { join } from 'path'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import type { Post } from '@/components/blog/PostCard'

export default function BlogPost({ params }: { params: { id: string } }) {
  let posts: Post[] = []
  try {
    posts = JSON.parse(readFileSync(join(process.cwd(), 'data/posts.json'), 'utf-8'))
  } catch {}

  const post = posts.find((p) => p.id === params.id)
  if (!post) notFound()

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(post.createdAt))

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <a
          href="/#blog"
          className="inline-block font-sans text-sm text-muted hover:text-accent transition-colors duration-200 mb-12"
        >
          ← Back
        </a>

        <div className="mb-8">
          <p className="font-sans text-xs text-subtle mb-3">{formatted}</p>
          <h1
            className="font-display font-black text-[clamp(30px,6vw,46px)] text-ink leading-tight tracking-tight mb-4"
            style={{ letterSpacing: '-1px' }}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            <span className="font-sans text-xs text-accent border border-accent px-2 py-0.5">
              {post.category}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="font-sans text-xs text-muted border border-[var(--border-md)] px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-8">
          <div className="prose prose-stone max-w-none font-sans font-light text-ink leading-relaxed [&_h1]:font-display [&_h1]:font-black [&_h1]:tracking-tight [&_h2]:font-display [&_h2]:font-black [&_h2]:tracking-tight [&_h3]:font-display [&_h3]:font-black [&_pre]:bg-card [&_pre]:border [&_pre]:border-[var(--border-md)] [&_code]:bg-card [&_code]:border [&_code]:border-[var(--border-md)] [&_code]:px-1 [&_a]:text-accent [&_a]:no-underline [&_a:hover]:underline">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--border)] flex justify-between">
          <a
            href="/#blog"
            className="font-sans text-sm text-muted hover:text-accent transition-colors duration-200"
          >
            ← All posts
          </a>
          <a
            href={`/blog/${post.id}/edit`}
            className="font-sans text-sm text-muted hover:text-accent transition-colors duration-200"
          >
            Edit ✎
          </a>
        </div>
      </div>
    </div>
  )
}
