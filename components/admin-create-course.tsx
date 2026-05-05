
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Rationale } from "next/font/google"

interface AdminCreateCourseProps {
  onPublish?: () => void
}

interface Casualty {
  name: string
  injuries: string[]
  status: string
}

interface Inject {
  type: string
  location: string
}

interface ExpectedAction {
  action: string
  justification: string
}

interface EvaluationMetric {
  metric: string
  target: string
}

interface Environment {
  location: string
  terrain: string
  weather: string
}

interface GeneratedScenario {
  environment: Environment
  skill_category: string
  skill: string
  difficulty: string
  casualties: Casualty[]
  injects: Inject[]
  objectives: Array<{ type: string; description: string }>
  expected_actions: ExpectedAction[]
  evaluation_metrics: EvaluationMetric[]
  rationale?: string
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
  const [scenarioId, setScenarioId] = useState<string | null>(null)


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
      const response = await fetch("http://localhost:8000/scenario/generate_scenario", {
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

      //added
      const data = await response.json()
      console.log("[v0] Backend response:", data)

      if (data.scenario_id) {
        setScenarioId(data.scenario_id)
        }

      if (data.scenario_spec && data.rationale) {
        const parsedScenario: GeneratedScenario = {
          ...data.scenario_spec,
          rationale: data.rationale,
        }
        setGeneratedScenario(parsedScenario)
        setScenarioGenerated(true)
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Scenario generated successfully! Review and edit the details below. You can modify any section by clicking on it.",
          },
        ])
      } else {
        throw new Error("Invalid response format from backend")
      }

      setIsGenerating(false)
    } catch (error) {
      console.error("[v0] Error generating scenario:", error)
      setIsGenerating(false)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error generating scenario. Please check the backend connection and try again.",
        },
      ])
    }
  }

  const handleSavePublish = async () => {
    console.log("[v0] Admin: Save scenario request")
    setIsSaving(true)

    if (!courseName || courseName.trim() === "") {
    alert("Course Name cannot be empty.");
    return; // stop the save
  }

    try {
      const response = await fetch("http://localhost:8000/scenario/save_scenario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
      user_id: localStorage.getItem("user_id"),
      scenario_id: scenarioId,
      scenario_json: generatedScenario,
      skill: skill,
      skill_category: skillCategory,
      difficulty: difficulty,
      course_name: courseName,
      rationale: generatedScenario?.rationale
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

      //if (onPublish) {
      //  onPublish()
      //}
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
        name: "New Casualty",
        injuries: ["Specify injury"],
        status: "Stable",
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

  const updateCasualty = (index: number, field: keyof Casualty, value: string | string[]) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.casualties]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("casualties", updated)
    }
  }

  const addInjuryToCasualty = (casualtyIndex: number) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.casualties]
      updated[casualtyIndex].injuries = [...updated[casualtyIndex].injuries, "New injury"]
      updateScenarioField("casualties", updated)
    }
  }

  const removeInjuryFromCasualty = (casualtyIndex: number, injuryIndex: number) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.casualties]
      updated[casualtyIndex].injuries = updated[casualtyIndex].injuries.filter((_, i) => i !== injuryIndex)
      updateScenarioField("casualties", updated)
    }
  }

  const updateInjury = (casualtyIndex: number, injuryIndex: number, value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.casualties]
      updated[casualtyIndex].injuries[injuryIndex] = value
      updateScenarioField("casualties", updated)
    }
  }

  const addInject = () => {
    if (generatedScenario) {
      const newInject: Inject = { type: "New event", location: "Specify location" }
      updateScenarioField("injects", [...generatedScenario.injects, newInject])
    }
  }

  const removeInject = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.injects.filter((_, i) => i !== index)
      updateScenarioField("injects", updated)
    }
  }

  const updateInject = (index: number, field: keyof Inject, value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.injects]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("injects", updated)
    }
  }

  const addObjective = () => {
    if (generatedScenario) {
      updateScenarioField("objectives", [
        ...generatedScenario.objectives,
        { type: "Medical", description: "New objective" },
      ])
    }
  }

  const removeObjective = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.objectives.filter((_, i) => i !== index)
      updateScenarioField("objectives", updated)
    }
  }

  const updateObjective = (index: number, field: "type" | "description", value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.objectives]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("objectives", updated)
    }
  }

  const addExpectedAction = () => {
    if (generatedScenario) {
      updateScenarioField("expected_actions", [
        ...generatedScenario.expected_actions,
        { action: "New action", justification: "Justification" },
      ])
    }
  }

  const removeExpectedAction = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.expected_actions.filter((_, i) => i !== index)
      updateScenarioField("expected_actions", updated)
    }
  }

  const updateExpectedAction = (index: number, field: "action" | "justification", value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.expected_actions]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("expected_actions", updated)
    }
  }

  const addEvaluationMetric = () => {
    if (generatedScenario) {
      updateScenarioField("evaluation_metrics", [
        ...generatedScenario.evaluation_metrics,
        { metric: "New metric", target: "Target" },
      ])
    }
  }

  const removeEvaluationMetric = (index: number) => {
    if (generatedScenario) {
      const updated = generatedScenario.evaluation_metrics.filter((_, i) => i !== index)
      updateScenarioField("evaluation_metrics", updated)
    }
  }

  const updateEvaluationMetric = (index: number, field: "metric" | "target", value: string) => {
    if (generatedScenario) {
      const updated = [...generatedScenario.evaluation_metrics]
      updated[index] = { ...updated[index], [field]: value }
      updateScenarioField("evaluation_metrics", updated)
    }
  }

  const updateEnvironment = (field: keyof Environment, value: string) => {
    if (generatedScenario) {
      updateScenarioField("environment", { ...generatedScenario.environment, [field]: value })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create Course</h1>
        <p className="text-muted-foreground">AI-powered Tactical Medical Training scenario generation with RAG Agent</p>
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
                  <div className="border border-border rounded-md bg-muted/50 p-4 h-32 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[90%] px-3 py-2 rounded-lg text-sm ${
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
                    <div className="text-4xl" />
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

          {scenarioGenerated && generatedScenario && (
            <Card>
              <CardHeader>
                <CardTitle>Edit Scenario Details</CardTitle>
                <CardDescription>Click on sections to modify scenario elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("environment")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-sm">Environment</span>
                    {expandedSections.has("environment") ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                  {expandedSections.has("environment") && (
                    <div className="p-3 space-y-3 border-t border-border bg-muted/20">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Location</label>
                        <input
                          type="text"
                          value={generatedScenario.environment.location}
                          onChange={(e) => updateEnvironment("location", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Terrain</label>
                        <input
                          type="text"
                          value={generatedScenario.environment.terrain}
                          onChange={(e) => updateEnvironment("terrain", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Weather</label>
                        <input
                          type="text"
                          value={generatedScenario.environment.weather}
                          onChange={(e) => updateEnvironment("weather", e.target.value)}
                          className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Basic Info Section */}
                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("basic")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                      <div className="grid grid-cols-2 gap-2">
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
                          <label className="text-xs font-medium text-muted-foreground">Skill</label>
                          <input
                            type="text"
                            value={generatedScenario.skill}
                            onChange={(e) => updateScenarioField("skill", e.target.value)}
                            className="w-full px-3 py-1.5 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
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
                  )}
                </div>

                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("casualties")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={casualty.name}
                              onChange={(e) => updateCasualty(idx, "name", e.target.value)}
                              placeholder="Casualty name"
                              className="flex-1 px-2 py-1 text-xs font-semibold rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCasualty(idx)}
                              className="h-6 w-6 p-0 ml-2 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Injuries</label>
                            {casualty.injuries.map((injury, injIdx) => (
                              <div key={injIdx} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={injury}
                                  onChange={(e) => updateInjury(idx, injIdx, e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeInjuryFromCasualty(idx, injIdx)}
                                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              onClick={() => addInjuryToCasualty(idx)}
                              size="sm"
                              variant="outline"
                              className="w-full text-xs h-7"
                            >
                              <Plus className="h-3 w-3 mr-1" /> Add Injury
                            </Button>
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-medium text-muted-foreground">Status</label>
                            <input
                              type="text"
                              value={casualty.status}
                              onChange={(e) => updateCasualty(idx, "status", e.target.value)}
                              placeholder="Status"
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

                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("injects")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Inject {idx + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeInject(idx)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={inject.type}
                            onChange={(e) => updateInject(idx, "type", e.target.value)}
                            placeholder="Event type"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="text"
                            value={inject.location}
                            onChange={(e) => updateInject(idx, "location", e.target.value)}
                            placeholder="Location"
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

                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("objectives")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                        <div key={idx} className="border border-border rounded bg-background p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={obj.type}
                              onChange={(e) => updateObjective(idx, "type", e.target.value)}
                              placeholder="Type"
                              className="w-24 px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeObjective(idx)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={obj.description}
                            onChange={(e) => updateObjective(idx, "description", e.target.value)}
                            placeholder="Description"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                      <Button onClick={addObjective} size="sm" variant="outline" className="w-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" /> Add Objective
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("actions")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                        <div key={idx} className="border border-border rounded bg-background p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Action {idx + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeExpectedAction(idx)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={action.action}
                            onChange={(e) => updateExpectedAction(idx, "action", e.target.value)}
                            placeholder="Action"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="text"
                            value={action.justification}
                            onChange={(e) => updateExpectedAction(idx, "justification", e.target.value)}
                            placeholder="Justification (e.g., TCCC Guidelines reference)"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                      <Button onClick={addExpectedAction} size="sm" variant="outline" className="w-full bg-transparent">
                        <Plus className="h-3 w-3 mr-1" /> Add Action
                      </Button>
                    </div>
                  )}
                </div>

                <div className="border border-border rounded-md">
                  <button
                    onClick={() => toggleSection("metrics")}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
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
                        <div key={idx} className="border border-border rounded bg-background p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-muted-foreground">Metric {idx + 1}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeEvaluationMetric(idx)}
                              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          <input
                            type="text"
                            value={metric.metric}
                            onChange={(e) => updateEvaluationMetric(idx, "metric", e.target.value)}
                            placeholder="Metric name"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                          <input
                            type="text"
                            value={metric.target}
                            onChange={(e) => updateEvaluationMetric(idx, "target", e.target.value)}
                            placeholder="Target (e.g., Less than 2 minutes)"
                            className="w-full px-2 py-1 text-xs rounded bg-input border border-border focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      ))}
                      <Button
                        onClick={addEvaluationMetric}
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Metric
                      </Button>
                    </div>
                  )}
                </div>

                {generatedScenario.rationale && (
                  <div className="border border-border rounded-md">
                    <button
                      onClick={() => toggleSection("rationale")}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">Rationale</span>
                      {expandedSections.has("rationale") ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    {expandedSections.has("rationale") && (
                      <div className="p-3 border-t border-border bg-muted/20">
                        <textarea
                          value={generatedScenario.rationale}
                          onChange={(e) => updateScenarioField("rationale", e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 text-sm rounded bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

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