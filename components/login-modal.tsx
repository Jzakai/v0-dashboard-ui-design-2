"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { getSupabaseClient } from "@/lib/supabase/client"

interface LoginModalProps {
  onLogin: (role: "admin" | "trainee", name: string) => void
}

async function hashPassword(password: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map((byte) => byte.toString(16).padStart(2, "0")).join("")
}

export function LoginModal({ onLogin }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [adminCode, setAdminCode] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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

    let assignedRole: "admin" | "trainee" = "trainee"

    if (adminCode.trim()) {
      if (adminCode.trim() === "admin1212") {
        assignedRole = "admin"
      } else {
        setError("Invalid admin code")
        return
      }
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const normalizedEmail = email.trim().toLowerCase()
      const passwordHash = await hashPassword(password)

      const { data: existingUser, error: existingUserError } = await supabase
        .from("users")
        .select("user_id")
        .eq("email", normalizedEmail)
        .limit(1)

      if (existingUserError) throw existingUserError

      if (existingUser && existingUser.length > 0) {
        setError("An account with this email already exists")
        return
      }

      const { error: insertError } = await supabase.from("users").insert({
        name: name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        role: assignedRole,
      })

      if (insertError) {
        console.error("Insert error:", insertError)
        throw insertError
      }

      onLogin(assignedRole, name.trim())
    } catch (err: any) {
      console.error("[Sign-up error]", JSON.stringify(err, null, 2))
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

    try {
      const supabase = getSupabaseClient()
      const normalizedEmail = email.trim().toLowerCase()
      const passwordHash = await hashPassword(password)

      const { data, error: loginError } = await supabase
        .from("users")
        .select("name, role")
        .eq("email", normalizedEmail)
        .eq("password_hash", passwordHash)
        .limit(1)

      if (loginError) throw loginError

      const user = data?.[0]

      if (!user) {
        setError("Invalid email or password")
        return
      }

      if (user.role !== "admin" && user.role !== "trainee") {
        setError("Invalid user role")
        return
      }

      onLogin(user.role, user.name)
    } catch (err: any) {
      console.error("[Login error]", JSON.stringify(err, null, 2))
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
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Q5ZDlkOSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

            <div className="relative">
              <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
                <img
                  src="/images/riyadh-20air-20template.png"
                  alt="Tactex Logo"
                  className="h-full w-full object-contain"
                />
              </div>

              <h1 className="mb-2 text-xl font-bold text-white sm:text-2xl">
                TACTEX
              </h1>

              <p className="text-sm text-white/80">
                AI-driven Tactical Medical Training System Using VR
              </p>
            </div>
          </div>

          <form
            onSubmit={isSignUp ? handleSignUp : handleLogin}
            className="space-y-5 p-5 sm:p-8"
          >
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-card-foreground">
                  Full Name
                </label>
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
              <label className="block text-sm font-semibold text-card-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-card-foreground">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {isSignUp && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-card-foreground">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                    required={isSignUp}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-card-foreground">
                    Admin Code{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Enter admin code only if you are an admin"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="min-h-11 w-full rounded-xl border border-border bg-input px-4 py-3 text-card-foreground transition-all placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Leave empty to register as a trainee.
                  </p>
                </div>
              </>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="min-h-12 w-full rounded-xl bg-gradient-to-r from-[#1b7f5b] to-[#b11414] py-6 font-semibold text-white shadow-lg transition-all hover:from-[#1b7f5b]/90 hover:to-[#b11414]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? isSignUp
                  ? "Creating Account..."
                  : "Signing In..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>

            <div className="pb-2 pt-4 text-center">
              <p className="mb-2 text-sm text-muted-foreground">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
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
                  setAdminCode("")
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