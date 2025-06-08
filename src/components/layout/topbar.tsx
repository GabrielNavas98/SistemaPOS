'use client'
import { Button } from '@/components/ui/button'

export function Topbar() {
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    window.location.href = '/login'
  }

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-100 border-b">
      <span className="font-semibold text-lg">Dashboard</span>
      <Button variant="outline" onClick={logout}>Logout</Button>
    </header>
  )
}
