"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "./sidebar"

interface DashboardLayoutProps {
  children: ReactNode
  userRole: "admin" | "trainee"
  userName: string
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function DashboardLayout({ children, userRole, userName, onLogout, onNavigate }: DashboardLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    if (!mobileNavOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [mobileNavOpen])

  const handleNavigate = (page: string) => {
    setMobileNavOpen(false)
    onNavigate(page)
  }

  return (
    <div className="flex min-h-dvh">
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[1px] lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <Sidebar
        userRole={userRole}
        userName={userName}
        onLogout={onLogout}
        onNavigate={handleNavigate}
        mobileOpen={mobileNavOpen}
        onMobileClose={() => setMobileNavOpen(false)}
      />

      <div className="flex flex-1 min-w-0 flex-col bg-card lg:pl-72">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            aria-expanded={mobileNavOpen}
            aria-controls="app-sidebar"
            aria-label={mobileNavOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">Tactex</p>
            <p className="truncate text-xs text-muted-foreground capitalize">{userRole} · {userName}</p>
          </div>
        </header>

        <main className="flex-1 bg-background px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
