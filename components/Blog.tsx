'use client'

import { useState, useEffect } from 'react'
import PostCard, { type Post } from './blog/PostCard'

type Category = 'All' | 'Leetcode' | 'Thoughts'
const categories: Category[] = ['All', 'Leetcode', 'Thoughts']

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        setPosts(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered =
    activeCategory === 'All'
      ? posts
      : posts.filter((p) => p.category === activeCategory)

  return (
    <section
      id="blog"
      className="py-20 px-6 max-w-6xl mx-auto border-t border-[var(--border)]"
    >
      <div className="flex justify-between items-end mb-6">
        <div>
          <p className="section-label">Writing</p>
          <h2 className="font-display font-black text-[38px] leading-tight tracking-tight text-ink mb-0">
            Blogs
          </h2>
        </div>
        <a
          href="/blog/new"
          className="bg-ink text-cream font-sans text-sm font-normal px-4 py-2 hover:bg-accent transition-colors duration-200"
        >
          + New Post
        </a>
      </div>

      <div className="flex gap-1 mb-10 border-b border-[var(--border)]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="font-sans text-sm px-4 py-2 transition-colors duration-200 relative"
            style={{
              color: activeCategory === cat ? 'var(--amber)' : 'var(--muted)',
              borderBottom: activeCategory === cat ? '2px solid var(--amber)' : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="font-sans text-sm text-muted">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-sans text-sm text-muted">
            {posts.length === 0
              ? 'No posts yet. Write your first one!'
              : 'No posts in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[14px]">
          {filtered.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
