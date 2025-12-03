"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminCreateCourseProps {
  onPublish?: () => void
}

const validationErrors = [
  "Missing Respiration check in MARCH sequence.",
  "Tourniquet application time not specified for casualty #1.",
]

const scenarioData = {
  environment: "Urban street - post-engagement",
  skillCategory: "Hemorrhage Control",
  difficulty: "Medium",
  numberOfCasualties: 1,
  injuryType: "Severe lower limb hemorrhage",
  timeLimit: 300,
  requiredActions: ["Massive Hemorrhage", "Airway", "Respiration", "Circulation", "Hypothermia"],
  protocol: "MARCH",
  assetCount: 12,
  fpsTarget: 90,
}

export function AdminCreateCourse({ onPublish }: AdminCreateCourseProps) {
  const [courseName, setCourseName] = useState("")
  const [description, setDescription] = useState("")
  const [skillCategory, setSkillCategory] = useState("Hemorrhage Control")
  const [skill, setSkill] = useState("Tourniquet Application")
  const [difficulty, setDifficulty] = useState("Medium")
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [userInput, setUserInput] = useState("")

  const handleGenerateScenario = () => {
    setShowChatbot(true)
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI scenario generator. Please specify the skill category, skill, and difficulty level for your training scenario.",
      },
    ])
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    setChatMessages([
      ...chatMessages,
      { role: "user", content: userInput },
      {
        role: "assistant",
        content:
          "Generating scenario based on your specifications... I've created a combat medical scenario focusing on hemorrhage control in an urban environment. The scenario includes validation checks for TCCC protocol compliance and OpenXR compatibility.",
      },
    ])
    setUserInput("")
  }

  const handleSavePublish = () => {
    console.log("[v0] Publishing course with validation checks")
    if (onPublish) {
      onPublish()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Course</h1>
        <p className="text-muted-foreground">AI-powered scenario generation with validation</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Scenario Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Configuration</CardTitle>
            <CardDescription>Define parameters for AI generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course Name</label>
              <input
                type="text"
                placeholder="e.g., Hemorrhage Control - Urban Combat"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                placeholder="Brief description of the training objective"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill Category</label>
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Hemorrhage Control</option>
                <option>Airway Management</option>
                <option>Chest Trauma</option>
                <option>Shock Management</option>
                <option>Mass Casualty Triage</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Tourniquet Application</option>
                <option>Wound Packing</option>
                <option>Pressure Dressing</option>
                <option>Nasopharyngeal Airway</option>
                <option>Chest Seal Application</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleGenerateScenario}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Generate Scenario
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Clear Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - AI Chatbot & Output */}
        <Card>
          <CardHeader>
            <CardTitle>AI Scenario Generator</CardTitle>
            <CardDescription>Powered by RAG Agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {showChatbot ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Chat with AI</label>
                  <div className="border border-border rounded-md bg-muted/50 p-4 h-48 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border border-border text-foreground"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Specify modifications or confirm..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1 px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSendMessage} size="sm">
                      Send
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Generated Scenario (JSON)</label>
                  <pre className="w-full px-4 py-2 rounded-md bg-muted text-foreground border border-border overflow-auto text-xs h-32">
                    {JSON.stringify(scenarioData, null, 2)}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 space-y-2">
                    <label className="text-sm font-semibold text-destructive flex items-center gap-2">
                      ⚠️ Validation Checks
                    </label>
                    <div className="space-y-1">
                      <div className="text-xs text-foreground">✓ TCCC/MARCH protocol compliance</div>
                      <div className="text-xs text-foreground">
                        ✓ Asset count within limits ({scenarioData.assetCount})
                      </div>
                      <div className="text-xs text-foreground">
                        ✓ FPS target achievable ({scenarioData.fpsTarget}fps)
                      </div>
                    </div>
                    {validationErrors.length > 0 && (
                      <ul className="space-y-1 mt-2 pt-2 border-t border-destructive/20">
                        {validationErrors.map((error, idx) => (
                          <li key={idx} className="text-xs text-destructive/80">
                            • {error}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowChatbot(true)}>
                    Edit Scenario
                  </Button>
                  <Button
                    onClick={handleSavePublish}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={validationErrors.length > 0}
                  >
                    Save & Publish
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full py-16 text-center">
                <div className="space-y-3">
                  <div className="text-4xl">🤖</div>
                  <p className="text-sm text-muted-foreground">
                    Click "Generate Scenario" to start
                    <br />
                    creating your VR training course
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
