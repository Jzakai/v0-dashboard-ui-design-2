import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get backend URL from environment variable or use default
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

    console.log("[v0] Proxying generate_scenario request to backend:", backendUrl)

    const response = await fetch(`${backendUrl}/scenario/generate_scenario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend error:", errorText)
      return NextResponse.json({ error: "Backend request failed", details: errorText }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error proxying to backend:", error)
    return NextResponse.json(
      { error: "Failed to connect to backend", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
