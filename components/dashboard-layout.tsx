"use client"

import type { ReactNode } from "react"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  userRole: "admin" | "trainee"
  userName: string
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function DashboardLayout({ children, userRole, userName, onLogout, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="flex">
      <Sidebar userRole={userRole} onLogout={onLogout} onNavigate={onNavigate} />
      <div className="flex-1 ml-64 bg-card">
        <main className="p-8 bg-background min-h-screen">{children}</main>
      </div>
    </div>
  )
}
