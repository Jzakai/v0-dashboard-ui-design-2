"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminCreateCourseProps {
  onPublish?: () => void
}

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

const skillsByCategory: Record<string, string[]> = {
  "Care Under Fire": ["Hemorrhage control", "Tourniquet application", "Tactical movement under fire"],
  "Tactical Field Care": ["Airway opening", "Needle-D chest decompression", "Wound packing", "Pain control"],
  "Tactical Evacuation": ["Litter carry", "Communication (MIST report)", "Triage decisions"],
}

export function AdminCreateCourse({ onPublish }: AdminCreateCourseProps) {
  const [courseName, setCourseName] = useState("")
  const [description, setDescription] = useState("")
  const [skillCategory, setSkillCategory] = useState("Care Under Fire")
  const [skill, setSkill] = useState("Hemorrhage control")
  const [difficulty, setDifficulty] = useState("Medium")

  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [scenarioGenerated, setScenarioGenerated] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleSkillCategoryChange = (newCategory: string) => {
    setSkillCategory(newCategory)
    // Reset skill to the first option of the new category
    const availableSkills = skillsByCategory[newCategory] || []
    if (availableSkills.length > 0) {
      setSkill(availableSkills[0])
    }
  }

  const handleGenerateScenario = () => {
    console.log("[v0] Admin: Input scenario details")
    setShowChatbot(true)
    setScenarioGenerated(false)
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI scenario generator powered by RAG Agent. Please describe the training scenario you'd like to create, including skill category, difficulty, and any specific requirements.",
      },
    ])
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const userMessage = userInput
    setUserInput("")
    setIsGenerating(true)

    console.log("[v0] RAG Agent: Processing input and retrieving context")
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    // Simulate RAG Agent processing
    setTimeout(() => {
      console.log("[v0] LLM: Generating scenario based on context")
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Processing your request with RAG Agent... Retrieving TCCC guidelines and VR asset library... Generating scenario...",
        },
      ])

      // Simulate LLM generation
      setTimeout(() => {
        console.log("[v0] System: Returning scenario JSON to Admin")
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Scenario generated successfully! I've created a combat medical scenario focusing on hemorrhage control in an urban environment. The scenario includes MARCH protocol validation and OpenXR compatibility checks. Review the JSON output below.",
          },
        ])
        setScenarioGenerated(true)
        setIsGenerating(false)

        // Run validation
        const errors = [
          "Missing Respiration check in MARCH sequence.",
          "Tourniquet application time not specified for casualty #1.",
        ]
        setValidationErrors(errors)
        console.log("[v0] Validation errors found:", errors.length)
      }, 2000)
    }, 1500)
  }

  const handleEditScenario = () => {
    console.log("[v0] Admin: Edit scenario request")
    setIsEditMode(true)
    setChatMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "Edit mode activated. Please specify the changes you'd like to make to the scenario. I'll validate them against TCCC protocols.",
      },
    ])
  }

  const handleSavePublish = () => {
    if (validationErrors.length > 0) {
      console.log("[v0] Cannot save: Validation errors present")
      return
    }

    console.log("[v0] Admin: Save scenario request")
    setIsSaving(true)

    // Simulate database save
    setTimeout(() => {
      console.log("[v0] System: Storing scenario in database")
      setTimeout(() => {
        console.log("[v0] System: Scenario saved successfully")
        setIsSaving(false)
        alert("✓ Scenario saved and published successfully!\n\nThe course is now available for assignment to trainees.")

        if (onPublish) {
          onPublish()
        }
      }, 1000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Course</h1>
        <p className="text-muted-foreground">AI-powered scenario generation with RAG Agent</p>
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
                onChange={(e) => handleSkillCategoryChange(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Care Under Fire</option>
                <option>Tactical Field Care</option>
                <option>Tactical Evacuation</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {skillsByCategory[skillCategory]?.map((skillOption) => (
                  <option key={skillOption} value={skillOption}>
                    {skillOption}
                  </option>
                ))}
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
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Scenario"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => {
                  setCourseName("")
                  setDescription("")
                  setShowChatbot(false)
                  setScenarioGenerated(false)
                }}
              >
                Clear Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - AI Chatbot & Output */}
        <Card>
          <CardHeader>
            <CardTitle>AI Scenario Generator</CardTitle>
            <CardDescription>Powered by RAG Agent + LLM</CardDescription>
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
                    {isGenerating && (
                      <div className="flex justify-start">
                        <div className="bg-background border border-border px-3 py-2 rounded-lg text-sm">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                            <span className="text-muted-foreground">Processing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Specify modifications or confirm..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isGenerating}
                      className="flex-1 px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    />
                    <Button onClick={handleSendMessage} size="sm" disabled={isGenerating}>
                      Send
                    </Button>
                  </div>
                </div>

                {scenarioGenerated && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Generated Scenario (JSON)</label>
                      <pre className="w-full px-4 py-2 rounded-md bg-muted text-foreground border border-border overflow-auto text-xs h-32">
                        {JSON.stringify(scenarioData, null, 2)}
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="bg-destructive/10 border border-destructive/30 rounded-md p-4 space-y-2">
                        <label className="text-sm font-semibold text-destructive flex items-center gap-2">
                          Validation Checks
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
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={handleEditScenario}
                        disabled={isSaving}
                      >
                        Edit Scenario
                      </Button>
                      <Button
                        onClick={handleSavePublish}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={validationErrors.length > 0 || isSaving}
                      >
                        {isSaving ? "Saving..." : "Save & Publish"}
                      </Button>
                    </div>
                  </>
                )}
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
