"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Sparkles, Users, TrendingUp, Target, LogOut } from "lucide-react"

interface SidebarProps {
  userRole: "admin" | "trainee"
  onLogout: () => void
  onNavigate: (page: string) => void
}

export function Sidebar({ userRole, onLogout, onNavigate }: SidebarProps) {
  const [activeItem, setActiveItem] = useState(userRole === "admin" ? "analytics" : "my-trainings")

  const adminItems = [
    { id: "create-course", label: "Create Course", icon: Sparkles, description: "AI-powered" },
    { id: "assign-courses", label: "Assign Courses", icon: Users, description: "To trainees" },
    { id: "analytics", label: "AAR Analytics", icon: TrendingUp, description: "Performance" },
  ]

  const traineeItems = [
    { id: "my-trainings", label: "My Trainings", icon: Target, description: "VR courses" },
    { id: "my-results", label: "My Results", icon: TrendingUp, description: "AAR & feedback" },
  ]

  const items = userRole === "admin" ? adminItems : traineeItems

  const handleClick = (itemId: string) => {
    setActiveItem(itemId)
    onNavigate(itemId)
  }

  return (
    <aside className="w-72 bg-sidebar border-r border-sidebar-border h-screen flex flex-col fixed left-0 top-0 shadow-xl">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-sidebar-border bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">Tactex</h1>
            <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.map((item) => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={cn(
                "w-full flex items-start gap-4 px-4 py-3.5 rounded-xl transition-all group",
                activeItem === item.id
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10 hover:text-sidebar-foreground",
              )}
            >
              <IconComponent
                className={cn("w-5 h-5 mt-0.5 flex-shrink-0", activeItem === item.id ? "text-white" : "text-primary")}
              />
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
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
