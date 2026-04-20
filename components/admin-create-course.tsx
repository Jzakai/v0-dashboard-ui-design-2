"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Plus, Trash2, Brain } from "lucide-react"

interface AdminCreateCourseProps {
  onPublish?: () => void
}

interface Casualty {
  id: string
  injury_type: string
  severity: string
  location: string
}

interface Inject {
  time: number
  event: string
  description: string
}

interface GeneratedScenario {
  environment: string
  skill_category: string
  skill: string
  difficulty: string
  casualties: Casualty[]
  injects: Inject[]
  objectives: string[]
  expected_actions: string[]
  evaluation_metrics: string[]
}

const skillsByCategory: Record<string, string[]> = {
  "Care Under Fire": ["Hemorrhage control", "Tourniquet application", "Tactical movement under fire"],
  "Tactical Field Care": ["Airway opening", "Needle-D chest decompression", "Wound packing", "Pain control"],
  "Tactical Evacuation": ["Litter carry", "Communication (MIST report)", "Triage decisions"],
}

export function AdminCreateCourse({ onPublish }: AdminCreateCourseProps) {
  const [courseName, setCourseName] = useState("")
  const [skillCategory, setSkillCategory] = useState("Care Under Fire")
  const [skill, setSkill] = useState("Hemorrhage control")
  const [difficulty, setDifficulty] = useState("Medium")

  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [userInput, setUserInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [scenarioGenerated, setScenarioGenerated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [generatedScenario, setGeneratedScenario] = useState<GeneratedScenario | null>(null)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const handleSkillCategoryChange = (newCategory: string) => {
    setSkillCategory(newCategory)
    const availableSkills = skillsByCategory[newCategory] || []
    if (availableSkills.length > 0) {
      setSkill(availableSkills[0])
    }
  }

  const handleGenerateScenario = async () => {
    console.log("[v0] Admin: Input scenario details")
    setShowChatbot(true)
    setScenarioGenerated(false)
    setChatMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm your AI scenario generator powered by RAG Agent. I'll generate a scenario based on your configuration. Please wait...",
      },
    ])

    // Send POST request to backend
    try {
      setIsGenerating(true)
      const response = await fetch("http://127.0.0.1:8000/scenario/generate_scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skill_category: skillCategory,
          skill: skill,
          difficulty: difficulty,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Backend response:", data)

      const mockScenario: GeneratedScenario = {
        environment: "Urban street - post-engagement zone with damaged vehicles",
        skill_category: skillCategory,
        skill: skill,
        difficulty: difficulty,
        casualties: [
          {
            id: "casualty_1",
            injury_type: "Severe lower limb hemorrhage",
            severity: "Critical",
            location: "Left femoral artery",
          },
        ],
        injects: [
          { time: 30, event: "Enemy fire nearby", description: "Sporadic gunfire 200m east" },
          { time: 90, event: "Casualty becomes unresponsive", description: "Check airway and breathing" },
        ],
        objectives: [
          "Control massive hemorrhage within 60 seconds",
          "Apply tourniquet correctly",
          "Assess and manage airway",
        ],
        expected_actions: [
          "Apply tourniquet high and tight",
          "Mark time on tourniquet",
          "Check distal pulse",
          "Monitor casualty vitals",
        ],
        evaluation_metrics: [
          "Time to hemorrhage control",
          "Tourniquet placement accuracy",
          "MARCH protocol adherence",
          "Communication effectiveness",
        ],
      }

      setGeneratedScenario(mockScenario)
      setScenarioGenerated(true)
      setIsGenerating(false)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Scenario generated successfully! Review and edit the details below. You can modify any section by clicking on it.",
        },
      ])
    } catch (error) {
      console.error("[v0] Error generating scenario:", error)
      setIsGenerating(false)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error connecting to backend. Showing demo scenario for testing.",
        },
      ])
    }
  }

  const handleSavePublish = async () => {
    console.log("[v0] Admin: Save scenario request")
    setIsSaving(true)

    try {
      const response = await fetch("/save_scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseName,
          skillCategory,
          skill,
          difficulty,
          scenario: generatedScenario,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Backend response:", data)
      console.log("[v0] System: Scenario saved successfully")

      setIsSaving(false)
      alert("✓ Scenario saved and published successfully!\n\nThe course is now available for assignment to trainees.")

      if (onPublish) {
        onPublish()
      }
    } catch (error) {
      console.error("[v0] Error saving scenario:", error)
      setIsSaving(false)
      alert("Error saving scenario. Please check the console and ensure the backend is running.")
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const updateScenarioField = (field: keyof GeneratedScenario, value: any) => {
    if (generatedScenario) {
      setGeneratedScenario({ ...generatedScenario, [field]: value })
    }
  }

  const addCasualty = () => {
    if (generatedScenario) {
      const newCasualty: Casualty = {
        id: `casualty_${generatedScenario.casualties.length + 1}`,
        injury_type: "New injury",
        severity: "Moderate",
        location: "Specify location",
      }
      updateScenarioField("casualties", [...generatedScenario.casualties, newCasualty])
    }
  }

  const removeCasualty = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.casualties.filter((_, i) => i !== index)
      updateScenarioField("casualties", updated)
    }
  }

  const updateCasualty = (index: number, field: keyof Casualty, value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.casualties]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("casualties", updated)
    }
  }

  const addInject = () => {
    if (generatedScenario) {
      const newInject: Inject = { time: 0, event: "New event", description: "Description" }
      updateScenarioField("injects", [...generatedScenario.injects, newInject])
    }
  }

  const removeInject = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.injects.filter((_, i) => i !== index)
      updateScenarioField("injects", updated)
    }
  }

  const updateInject = (index: number, field: keyof Inject, value: string | number) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.injects]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("injects", updated)
    }
  }

  const addArrayItem = (field: "objectives" | "expected_actions" | "evaluation_metrics") => {
    if (generatedScenario) {
      updateScenarioField(field, [...generatedScenario[field], "New item"])
    }
  }

  const removeArrayItem = (field: "objectives" | "expected_actions" | "evaluation_metrics", index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario[field].filter((_, i) => i !== index)
      updateScenarioField(field, updated)
    }
  }

  const updateArrayItem = (
    field: "objectives" | "expected_actions" | "evaluation_metrics",
    index: number,
    value: string,
  ) => {
    if (generatedScenario) {
      const updated = [...generatedScenario[field]]
      updated[index] = value
      updateScenarioField(field, updated)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Create Course</h1>
        <p className="text-muted-foreground">AI-powered scenario generation with RAG Agent</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
        {/* Left Column - Scenario Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Scenario Configuration</CardTitle>
            <CardDescription>Define the scenario parameters </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Course Name</label>
              <input
                type="text"
                placeholder="e.g., Hemorrhage Control - Urban Combat"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill Category</label>
              <select
                value={skillCategory}
                onChange={(e) => handleSkillCategoryChange(e.target.value)}
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="min-h-11 w-full rounded-md border border-border bg-input px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button
                onClick={handleGenerateScenario}
                className="w-full flex-1 bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Scenario"}
              </Button>
              <Button
                variant="outline"
                className="w-full flex-1 bg-transparent sm:w-auto"
                onClick={() => {
                  setCourseName("")
                  setShowChatbot(false)
                  setScenarioGenerated(false)
                  setGeneratedScenario(null)
                }}
              >
                Clear Fields
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Scenario Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Scenario Generator</CardTitle>
              <CardDescription>Powered by RAG Agent + LLM</CardDescription>
            </CardHeader>
            <CardContent>
              {showChatbot ? (
                <div className="space-y-3">
                  <div className="h-36 space-y-3 overflow-y-auto rounded-md border border-border bg-muted/50 p-3 sm:h-40 sm:p-4">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[min(90vw,20rem)] px-3 py-2 rounded-lg text-sm sm:max-w-[85%] ${
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
                </div>
              ) : (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-3">
                    <div className="flex justify-center">
                      
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click "Generate Scenario" to start
                      <br />
                      creating the VR training course
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {scenarioGenerated && generatedScenario && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Scenario Details</CardTitle>
                <CardDescription>Click on sections to modify scenario elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                {/* Basic Info Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("basic")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">Basic Information</span>
                    {expandedSections.has("basic") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("basic") && (
                    <div className="p-3 space-y-3 border-t border-border bg-muted/20">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Environment</label>
                        <input
                          type="text"
                          value={generatedScenario.environment}
                          onChange={(e) => updateScenarioField("environment", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Skill Category</label>
                          <input
                            type="text"
                            value={generatedScenario.skill_category}
                            onChange={(e) => updateScenarioField("skill_category", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground">Difficulty</label>
                          <select
                            value={generatedScenario.difficulty}
                            onChange={(e) => updateScenarioField("difficulty", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Casualties Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("casualties")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">Casualties ({generatedScenario.casualties.length})</span>
                    {expandedSections.has("casualties") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("casualties") && (
                    <div className="p-3 space-y-3 border-t border-border bg-muted/20">
                      {generatedScenario.casualties.map((casualty, idx) => (
                        <div key={idx} className="border border-border rounded bg-background p-3 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="min-w-0 truncate text-xs font-semibold text-muted-foreground">{casualty.id}</span>
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => removeCasualty(idx)}
                              className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={casualty.injury_type}
                            onChange={(e) => updateCasualty(idx, "injury_type", e.target.value)}
                            placeholder="Injury type"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <input
                              type="text"
                              value={casualty.severity}
                              onChange={(e) => updateCasualty(idx, "severity", e.target.value)}
                              placeholder="Severity"
                              className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <input
                              type="text"
                              value={casualty.location}
                              onChange={(e) => updateCasualty(idx, "location", e.target.value)}
                              placeholder="Location"
                              className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                      ))}
                      <Button onClick={addCasualty} size="sm" variant="outline" className="w-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" /> Add Casualty
                      </Button>
                    </div>
                  )}
                </div>

                {/* Injects Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("injects")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">Injects ({generatedScenario.injects.length})</span>
                    {expandedSections.has("injects") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("injects") && (
                    <div className="p-3 space-y-3 border-t border-border bg-muted/20">
                      {generatedScenario.injects.map((inject, idx) => (
                        <div key={idx} className="border border-border rounded bg-background p-3 space-y-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <input
                              type="number"
                              value={inject.time}
                              onChange={(e) => updateInject(idx, "time", Number.parseInt(e.target.value))}
                              placeholder="Time (s)"
                              className="min-h-9 w-full rounded border border-border bg-input px-2 py-2 text-xs sm:w-24"
                            />
                            <Button
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => removeInject(idx)}
                              className="shrink-0 self-end sm:self-auto hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={inject.event}
                            onChange={(e) => updateInject(idx, "event", e.target.value)}
                            placeholder="Event"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="text"
                            value={inject.description}
                            onChange={(e) => updateInject(idx, "description", e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                      <Button onClick={addInject} size="sm" variant="outline" className="w-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" /> Add Inject
                      </Button>
                    </div>
                  )}
                </div>

                {/* Objectives Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("objectives")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">Objectives ({generatedScenario.objectives.length})</span>
                    {expandedSections.has("objectives") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("objectives") && (
                    <div className="p-3 space-y-2 border-t border-border bg-muted/20">
                      {generatedScenario.objectives.map((obj, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={obj}
                            onChange={(e) => updateArrayItem("objectives", idx, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => removeArrayItem("objectives", idx)}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button onClick={() => addArrayItem("objectives")} size="sm" variant="outline" className="w-full">
                        <Plus className="h-3 w-3 mr-1" /> Add Objective
                      </Button>
                    </div>
                  )}
                </div>

                {/* Expected Actions Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("actions")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">
                      Expected Actions ({generatedScenario.expected_actions.length})
                    </span>
                    {expandedSections.has("actions") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("actions") && (
                    <div className="p-3 space-y-2 border-t border-border bg-muted/20">
                      {generatedScenario.expected_actions.map((action, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={action}
                            onChange={(e) => updateArrayItem("expected_actions", idx, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => removeArrayItem("expected_actions", idx)}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addArrayItem("expected_actions")}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Action
                      </Button>
                    </div>
                  )}
                </div>

                {/* Evaluation Metrics Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("metrics")}
                    className="flex min-h-11 w-full items-center justify-between gap-2 p-3 text-left transition-colors hover:bg-muted/50"
                  >
                    <span className="font-medium text-sm">
                      Evaluation Metrics ({generatedScenario.evaluation_metrics.length})
                    </span>
                    {expandedSections.has("metrics") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("metrics") && (
                    <div className="p-3 space-y-2 border-t border-border bg-muted/20">
                      {generatedScenario.evaluation_metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={metric}
                            onChange={(e) => updateArrayItem("evaluation_metrics", idx, e.target.value)}
                            className="flex-1 px-2 py-1 text-xs rounded bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => removeArrayItem("evaluation_metrics", idx)}
                            className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        onClick={() => addArrayItem("evaluation_metrics")}
                        size="sm"
                        variant="outline"
                        className="w-full"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Metric
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleSavePublish}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Publish Course"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
