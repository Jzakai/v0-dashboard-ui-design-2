"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LoginModalProps {
  onLogin: (role: "admin" | "trainee", name: string, userId: string) => void
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"admin" | "trainee">("trainee") // used only for signup
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      let response;
      let data;

      if (isSignup) {
        // SIGNUP REQUEST
        response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name, role }),
        })
      } else {
        // LOGIN REQUEST
        response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      }

      data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      // Extract user info from backend response
      const userId = data.user.user_id
      const userName = data.user.name
      const userRole = data.user.role

      // Save user info
      localStorage.setItem("user_id", userId)
      localStorage.setItem("name", userName)
      localStorage.setItem("role", userRole)

      // Call parent
      onLogin(userRole, userName, userId)

    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          
          {/* HEADER */}
          <div className="relative bg-gradient-to-r from-[#1B7F5B] to-[#E52421] p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">TACTEX</h1>
            <p className="text-white/80 text-sm">AI-driven Tactical Medical Training System Using VR</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            
            {/* FULL NAME — ONLY IN SIGNUP */}
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                />
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Email / ID</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-input border border-border"
              />
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-input border border-border"
              />
            </div>

            {/* ROLE — ONLY SHOW IN SIGNUP */}
            {isSignup && (
              <div className="space-y-2">
                <label className="text-sm font-semibold">Select Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "trainee")}
                  className="w-full px-4 py-3 rounded-xl bg-input border border-border"
                >
                  <option value="admin">Administrator</option>
                  <option value="trainee">Trainee</option>
                </select>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
            </Button>

            {/* SWITCH MODE */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => { setIsSignup(!isSignup); setError("") }}
                className="text-sm text-primary hover:underline"
              >
                {isSignup ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
