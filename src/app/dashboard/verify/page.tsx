'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function VerifyPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        // Store email in localStorage so dashboard can use it
        localStorage.setItem('rr_business_email', session.user.email)
        setStatus('success')
        setTimeout(() => { window.location.href = '/dashboard' }, 1200)
      } else {
        setStatus('error')
      }
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 48, maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🔐</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>Verifying your link...</h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>Just a moment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>✅</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#166534', margin: '0 0 8px' }}>Verified!</h1>
            <p style={{ fontSize: 14, color: '#6b7280' }}>Redirecting to your dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>❌</div>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#dc2626', margin: '0 0 8px' }}>Link expired</h1>
            <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 24 }}>Magic links expire after 1 hour. Request a new one.</p>
            <a href="/dashboard" style={{ display: 'inline-block', background: '#1d4ed8', color: '#fff', fontWeight: 700, padding: '10px 24px', borderRadius: 10, textDecoration: 'none' }}>Try again →</a>
          </>
        )}
      </div>
    </div>
  )
}
