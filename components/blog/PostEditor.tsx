'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Post } from './PostCard'

interface PostEditorProps {
  existing?: Post
}

export default function PostEditor({ existing }: PostEditorProps) {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState('')

  const [title, setTitle] = useState(existing?.title ?? '')
  const [category, setCategory] = useState<'Leetcode' | 'Thoughts'>(
    existing?.category ?? 'Thoughts'
  )
  const [tags, setTags] = useState(existing?.tags?.join(', ') ?? '')
  const [content, setContent] = useState(existing?.content ?? '')
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  async function checkPassword() {
    const res = await fetch('/api/posts', {
      headers: { Authorization: `Bearer ${password}` },
    })
    if (res.ok) {
      setAuthed(true)
      setAuthError('')
    } else {
      setAuthError('Incorrect password.')
    }
  }

  async function handleSave() {
    setSaving(true)
    setSaveError('')

    const body = {
      title,
      category,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      content,
      excerpt: excerpt || content.replace(/[#*`]/g, '').slice(0, 120),
    }

    const url = existing ? `/api/posts/${existing.id}` : '/api/posts'
    const method = existing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json()
      router.push(`/blog/${data.id}`)
    } else {
      setSaveError(await res.text())
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!existing || !confirm('Delete this post?')) return
    const res = await fetch(`/api/posts/${existing.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${password}` },
    })
    if (res.ok) router.push('/')
  }

  const inputClass =
    'w-full font-sans text-sm text-ink bg-card border border-[var(--border-md)] px-4 py-3 outline-none focus:border-accent transition-colors'

  if (!authed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-black text-3xl text-ink mb-2 tracking-tight">
            {existing ? 'Edit Post' : 'New Post'}
          </h1>
          <p className="font-sans text-sm text-muted mb-8">Enter your blog password to continue.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
            placeholder="Password"
            className={inputClass + ' mb-3'}
          />
          {authError && (
            <p className="font-sans text-xs text-red-500 mb-3">{authError}</p>
          )}
          <button
            onClick={checkPassword}
            className="w-full bg-ink text-cream font-sans text-sm py-3 hover:bg-accent transition-colors duration-200"
          >
            Continue
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="font-display font-black text-3xl text-ink tracking-tight">
            {existing ? 'Edit Post' : 'New Post'}
          </h1>
          <a href="/" className="font-sans text-sm text-muted hover:text-accent transition-colors">
            ← Back
          </a>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="font-sans text-xs uppercase tracking-[0.1em] text-muted block mb-2">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title…"
              className="w-full font-display font-black text-2xl text-ink tracking-tight bg-card border border-[var(--border-md)] px-4 py-3 outline-none focus:border-accent transition-colors"
              style={{ letterSpacing: '-0.5px' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-sans text-xs uppercase tracking-[0.1em] text-muted block mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Leetcode' | 'Thoughts')}
                className={inputClass + ' appearance-none cursor-pointer'}
              >
                <option value="Thoughts">Thoughts</option>
                <option value="Leetcode">Leetcode</option>
              </select>
            </div>
            <div>
              <label className="font-sans text-xs uppercase tracking-[0.1em] text-muted block mb-2">
                Tags (comma separated)
              </label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, python, ux…"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="font-sans text-xs uppercase tracking-[0.1em] text-muted block mb-2">
              Excerpt (optional)
            </label>
            <input
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary shown in post cards…"
              className={inputClass}
            />
          </div>

          <div>
            <label className="font-sans text-xs uppercase tracking-[0.1em] text-muted block mb-2">
              Content (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post in markdown…"
              rows={20}
              className={inputClass + ' resize-y'}
            />
          </div>

          {saveError && (
            <p className="font-sans text-sm text-red-500">{saveError}</p>
          )}

          <div className="flex gap-4 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !title || !content}
              className="bg-ink text-cream font-sans text-sm px-8 py-3 hover:bg-accent transition-colors duration-200 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save Post'}
            </button>
            <a
              href="/"
              className="font-sans text-sm text-muted border border-[var(--border-strong)] px-6 py-3 hover:border-accent hover:text-accent transition-colors duration-200"
            >
              Cancel
            </a>
            {existing && (
              <button
                onClick={handleDelete}
                className="ml-auto font-sans text-sm text-red-500 border border-[var(--border-md)] px-6 py-3 hover:bg-card transition-colors duration-200"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
