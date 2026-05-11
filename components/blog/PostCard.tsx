'use client'

import { useState } from 'react'

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  category: 'Leetcode' | 'Thoughts'
  tags: string[]
  createdAt: string
}

function formatMeta(createdAt: string, content: string): string {
  const date = new Date(createdAt)

  const datePart = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

  const timePart = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)

  const wordCount = content.trim().split(/\s+/).length
  const readTime = Math.ceil(wordCount / 200)

  return `${datePart} · ${timePart} · ${readTime} min read`
}

export default function PostCard({ post, index }: { post: Post; index: number }) {
  const [hovered, setHovered] = useState(false)

  const tilt = index % 2 === 0 ? -1 : 1
  const excerpt = post.excerpt
    ? post.excerpt.slice(0, 90)
    : post.content.replace(/[#*`]/g, '').slice(0, 90)

  return (
    <a
      href={`/blog/${post.id}`}
      className="project-card block relative bg-card border border-[var(--border)] p-6"
      style={{
        transform: hovered ? 'translateY(-5px) rotate(0deg)' : `rotate(${tilt}deg)`,
        boxShadow: hovered ? '0 14px 32px var(--shadow-card)' : 'none',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="amber-bar" />

      <div className="flex justify-between items-start mb-2">
        <span className="font-display font-light italic text-accent text-sm">
          {post.category}
        </span>
        <span
          className="text-xl leading-none transition-colors duration-200"
          style={{ color: hovered ? 'var(--amber)' : 'var(--light)' }}
        >
          ↗
        </span>
      </div>

      <p className="font-sans text-[11px] text-subtle mb-3">
        {formatMeta(post.createdAt, post.content)}
      </p>

      <h3
        className="font-display font-black text-[20px] text-ink mb-2"
        style={{ letterSpacing: '-0.4px' }}
      >
        {post.title}
      </h3>

      <p className="font-sans font-light text-muted text-[13px] leading-[1.6] mb-4">
        {excerpt}{excerpt.length >= 90 ? '…' : ''}
      </p>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="font-sans text-[10px] text-muted border border-[var(--border)] px-2 py-[3px]"
              style={{ backgroundColor: 'var(--tag-bg)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  )
}
