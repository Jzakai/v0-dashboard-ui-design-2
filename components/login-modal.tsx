"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
  onLogin: (role: "admin" | "trainee", name: string) => void
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<"admin" | "trainee">("trainee")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)
    console.log("[v0] Sign-up request initiated (dummy mode)", { name, email, role })

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("[v0] Sign-up successful (dummy mode)")
      // Auto-login after successful sign-up
      onLogin(role, name)
    } catch (err: any) {
      console.error("[v0] Sign-up error:", err)
      setError("Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setLoading(true)
    console.log("[v0] Login request initiated (dummy mode)", { email, role })

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      console.log("[v0] Login successful (dummy mode)")
      // Use email as name for now since we don't have a name field in login
      const userName = email.split("@")[0]
      onLogin(role, userName)
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      setError("Invalid credentials. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gradient-to-br from-background via-background to-primary/5 p-4 py-8 sm:p-6">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="relative bg-gradient-to-r from-[#1b7f5b] to-[#b11414] p-6 text-center sm:p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q5ZDlkOSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
            <div className="relative">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
                <img
                  src="/images/riyadh-20air-20template.png"
                  alt="Tactex Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">TACTEX</h1>
              <p className="text-sm text-white/80">AI-driven Tactical Medical Training System Using VR</p>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5 p-5 sm:p-8">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-card-foreground block">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-card-foreground block">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-card-foreground block">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  required={isSignUp}
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-card-foreground block">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "trainee")}
                className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">Administrator</option>
                <option value="trainee">Trainee</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-gradient-to-r from-[#1b7f5b] to-[#b11414] py-6 font-semibold text-white shadow-lg transition-all hover:from-[#1b7f5b]/90 hover:to-[#b11414]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (isSignUp ? "Creating Account..." : "Signing In...") : isSignUp ? "Create Account" : "Sign In"}
            </Button>

            <div className="text-center pt-4 pb-2">
              <p className="text-sm text-muted-foreground mb-2">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError("")
                  setName("")
                  setEmail("")
                  setPassword("")
                  setConfirmPassword("")
                }}
                className="min-h-11 w-full rounded-lg text-base font-semibold text-primary underline transition-colors hover:text-primary/80 sm:min-h-0 sm:w-auto"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
  
}
