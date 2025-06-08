// app/dashboard/layout.tsx
import { ReactNode } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { Topbar } from '@/components/layout/topbar'
import { getAuthUser } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default function DashboardLayout({ children }: { children: ReactNode }) {

  const user = getAuthUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen w-screen bg-muted text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
