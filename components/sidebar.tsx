"use client"
"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Plus, Users, BarChart3, Target, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  userRole: "admin" | "trainee"
  userName?: string
  onLogout: () => void
  onNavigate: (page: string) => void
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export function Sidebar({ userRole, userName, onLogout, onNavigate, mobileOpen, onMobileClose }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(userRole === "admin" ? "create-course" : "my-trainings")

  const adminItems = [
    { id: "create-course", label: "Create Course", icon: Plus, description: "AI-powered" },
    { id: "assign-courses", label: "Assign Courses", icon: Users, description: "To trainees" },
    { id: "analytics", label: "AAR Analytics", icon: BarChart3, description: "Performance" },
  ]

  const traineeItems = [
    { id: "my-trainings", label: "My Trainings", icon: Target, description: "VR courses" },
    { id: "my-results", label: "My Results", icon: BarChart3, description: "AAR & feedback" },
  ]

  const items = userRole === "admin" ? adminItems : traineeItems
  const items = userRole === "admin" ? adminItems : traineeItems

  const handleClick = (itemId: string) => {
    setActiveItem(itemId)
    onNavigate(itemId)
  }
    setActiveItem(itemId)
    onNavigate(itemId)
  }

  return (
    <aside
      id="app-sidebar"
      className={cn(
        "fixed left-0 top-0 z-50 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-sidebar-border bg-sidebar shadow-xl transition-transform duration-200 ease-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      {/* Logo & Brand */}
      <div className="border-b border-sidebar-border bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6">
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-sidebar-foreground">Tactex</h1>
              <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              {userName ? (
                <p className="mt-0.5 truncate text-xs font-medium text-sidebar-foreground/90">{userName}</p>
              ) : null}
            </div>
          </div>
          {onMobileClose ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              aria-label="Close sidebar"
              onClick={onMobileClose}
            >
              <X className="size-5" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        {items.map((item) => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "group flex w-full min-h-11 items-start gap-4 rounded-xl px-4 py-3.5 text-left transition-all active:bg-sidebar-accent/15",
                activeItem === item.id
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
              )}
            >
              <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div className="flex-1 text-left">
                <div
                  className={cn(
                    "text-sm font-semibold",
                    activeItem === item.id ? "text-white" : "text-sidebar-foreground",
                  )}
                >
                  {item.label}
                </div>
                <div
                  className={cn("text-xs mt-0.5", activeItem === item.id ? "text-white/80" : "text-muted-foreground")}
                >
                  {item.description}
                </div>
              </div>
            </button>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-sidebar-border bg-sidebar-accent/5 p-3 sm:p-4">
        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-sidebar-foreground transition-all hover:bg-destructive/10 hover:text-destructive active:bg-destructive/15"
        >
          <LogOut className="w-5 h-5" />
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  )
  )
}
