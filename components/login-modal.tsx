"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
  onLogin: (role: "admin" | "trainee", name: string) => void
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"admin" | "trainee">("admin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(role, email || "Demo User")
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-[#1B7F5B] to-[#E52421] p-8 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQiKSIvPjwvc3ZnPg=')] opacity-30"></div>
            <div className="relative">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <img src="/images/image.png" alt="Tactex Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">TACTEX</h1>
              <p className="text-white/80 text-sm">AI-driven Tactical Medical Training System Using VR</p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-card-foreground block">Email / ID</label>
              <input
                type="email"
                placeholder="Enter your email or ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-card-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-card-foreground block">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-input text-card-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-card-foreground block">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "trainee")}
                className="w-full px-4 py-3 rounded-xl bg-input text-card-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="admin">Administrator</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#1B7F5B] to-[#E52421] hover:from-[#1B7F5B]/90 hover:to-[#E52421]/90 text-white font-semibold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">Demo mode - no credentials required</p>
          </form>
        </div>
      </div>
    </div>
  )
}
