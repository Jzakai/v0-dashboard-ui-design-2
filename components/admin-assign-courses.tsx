"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"

const trainees = [
  { id: 1, name: "John Smith", type: "Combat Medic", level: "Beginner" },
  { id: 2, name: "Sarah Johnson", type: "Field Medic", level: "Intermediate" },
  { id: 3, name: "Mike Davis", type: "Combat Medic", level: "Advanced" },
  { id: 4, name: "Emily White", type: "Tactical Medic", level: "Beginner" },
  { id: 5, name: "David Brown", type: "Field Medic", level: "Intermediate" },
]

const coursesByCategory = {
  "Care Under Fire": {
    "Hemorrhage control": {
      Beginner: ["Hemorrhage Control Basics – Urban Street"],
      Intermediate: ["Advanced Hemorrhage Control – Combat Zone"],
      Advanced: ["Expert Hemorrhage Control – Mass Casualty"],
    },
    "Tourniquet application": {
      Beginner: ["Tourniquet Application Basics – Training Ground"],
      Intermediate: ["Advanced Tourniquet Application – Urban Combat"],
      Advanced: ["Expert Tourniquet Application – High Threat"],
    },
    "Tactical movement under fire": {
      Beginner: ["Tactical Movement Basics – Open Field"],
      Intermediate: ["Advanced Tactical Movement – Urban Environment"],
      Advanced: ["Expert Tactical Movement – Combat Operations"],
    },
  },
  "Tactical Field Care": {
    "Airway opening": {
      Beginner: ["Airway Management Basics – Field Hospital"],
      Intermediate: ["Advanced Airway Management – Tactical Field"],
      Advanced: ["Expert Airway Management – Critical Care"],
    },
    "Needle-D chest decompression": {
      Beginner: ["Needle-D Basics – Training Facility"],
      Intermediate: ["Advanced Needle-D – Field Operations"],
      Advanced: ["Expert Needle-D – Critical Trauma"],
    },
    "Wound packing": {
      Beginner: ["Wound Packing Basics – Medical Bay"],
      Intermediate: ["Advanced Wound Packing – Combat Field"],
      Advanced: ["Expert Wound Packing – Severe Trauma"],
    },
    "Pain control": {
      Beginner: ["Pain Management Basics – Field Care"],
      Intermediate: ["Advanced Pain Management – Tactical Operations"],
      Advanced: ["Expert Pain Management – Critical Scenarios"],
    },
  },
  "Tactical Evacuation": {
    "Litter carry": {
      Beginner: ["Litter Carry Basics – Training Ground"],
      Intermediate: ["Advanced Litter Carry – Rough Terrain"],
      Advanced: ["Expert Litter Carry – Combat Evacuation"],
    },
    "Communication (MIST report)": {
      Beginner: ["MIST Reporting Basics – Training Exercise"],
      Intermediate: ["Advanced MIST Reporting – Field Operations"],
      Advanced: ["Expert MIST Reporting – Multi-Casualty"],
    },
    "Triage decisions": {
      Beginner: ["Triage Basics – Medical Facility"],
      Intermediate: ["Advanced Triage – Mass Casualty Event"],
      Advanced: ["Expert Triage – Combat Triage"],
    },
  },
}

export function AdminAssignCourses() {
  const [traineeNameFilter, setTraineeNameFilter] = useState("")
  const [traineeTypeFilter, setTraineeTypeFilter] = useState("")
  const [traineeLevelFilter, setTraineeLevelFilter] = useState("")
  const [selectedTrainees, setSelectedTrainees] = useState<number[]>([])

  const [skillCategory, setSkillCategory] = useState("")
  const [skill, setSkill] = useState("")
  const [courseLevel, setCourseLevel] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("")

  const [startDate, setStartDate] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)

  const filteredTrainees = trainees.filter((trainee) => {
    const matchesName = trainee.name.toLowerCase().includes(traineeNameFilter.toLowerCase())
    const matchesType = traineeTypeFilter === "" || trainee.type === traineeTypeFilter
    const matchesLevel = traineeLevelFilter === "" || trainee.level === traineeLevelFilter
    return matchesName && matchesType && matchesLevel
  })

  const availableSkills = skillCategory
    ? Object.keys(coursesByCategory[skillCategory as keyof typeof coursesByCategory] || {})
    : []

  const availableCourses =
    skillCategory && skill && courseLevel
      ? coursesByCategory[skillCategory as keyof typeof coursesByCategory]?.[
          skill as keyof (typeof coursesByCategory)[keyof typeof coursesByCategory]
        ]?.[
          courseLevel as keyof (typeof coursesByCategory)[keyof typeof coursesByCategory][keyof (typeof coursesByCategory)[keyof typeof coursesByCategory]]
        ] || []
      : []

  const handleSkillCategoryChange = (value: string) => {
    setSkillCategory(value)
    setSkill("")
    setCourseLevel("")
    setSelectedCourse("")
  }

  const handleSkillChange = (value: string) => {
    setSkill(value)
    setCourseLevel("")
    setSelectedCourse("")
  }

  const handleCourseLevelChange = (value: string) => {
    setCourseLevel(value)
    setSelectedCourse("")
  }

  const toggleTrainee = (id: number) => {
    setSelectedTrainees((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const handleAssignCourse = () => {
    if (selectedTrainees.length === 0 || !selectedCourse || !startDate || !dueDate) {
      alert("Please select trainees, course, and dates before assigning.")
      return
    }

    console.log("[v0] Admin: Select trainees and course")
    console.log("[v0] Selected trainees:", selectedTrainees)
    console.log("[v0] Course:", selectedCourse)

    setIsAssigning(true)

    setTimeout(() => {
      console.log("[v0] System: Assigning course to trainees")
      console.log("[v0] System: Updating trainee records")

      setTimeout(() => {
        console.log("[v0] System: Sending notifications to trainees")

        setTimeout(() => {
          console.log("[v0] System: Assignment complete")
          setIsAssigning(false)

          const selectedNames = trainees
            .filter((t) => selectedTrainees.includes(t.id))
            .map((t) => t.name)
            .join(", ")

          alert(
            `✓ Course assigned successfully!\n\n` +
              `Course: ${selectedCourse}\n` +
              `Trainees: ${selectedNames}\n` +
              `Start: ${startDate}\n` +
              `Due: ${dueDate}\n\n` +
              `Notifications have been sent to all selected trainees.`,
          )

          // Reset form
          setSelectedTrainees([])
          setSkillCategory("")
          setSkill("")
          setCourseLevel("")
          setSelectedCourse("")
          setStartDate("")
          setDueDate("")
        }, 1000)
      }, 1000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Assign Courses</h1>
        <p className="text-muted-foreground">Assign VR courses to trainees with notifications</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Trainee List */}
        <Card>
          <CardHeader>
            <CardTitle>Trainee List</CardTitle>
            <CardDescription>
              {selectedTrainees.length > 0 ? `${selectedTrainees.length} selected` : "Select trainees"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Search by name…"
                value={traineeNameFilter}
                onChange={(e) => setTraineeNameFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="grid grid-cols-2 gap-3">
                <select
                  value={traineeTypeFilter}
                  onChange={(e) => setTraineeTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  <option value="Combat Medic">Combat Medic</option>
                  <option value="Field Medic">Field Medic</option>
                  <option value="Tactical Medic">Tactical Medic</option>
                </select>

                <select
                  value={traineeLevelFilter}
                  onChange={(e) => setTraineeLevelFilter(e.target.value)}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-foreground">
                      <Checkbox />
                    </th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Name</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-foreground">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrainees.map((trainee) => (
                    <tr key={trainee.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-2">
                        <Checkbox
                          checked={selectedTrainees.includes(trainee.id)}
                          onCheckedChange={() => toggleTrainee(trainee.id)}
                        />
                      </td>
                      <td className="py-3 px-2 text-foreground">{trainee.name}</td>
                      <td className="py-3 px-2 text-foreground">{trainee.type}</td>
                      <td className="py-3 px-2 text-muted-foreground text-xs">{trainee.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Assignment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
            <CardDescription>Course and timeline configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Skill Category</label>
              <select
                value={skillCategory}
                onChange={(e) => handleSkillCategoryChange(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">Select skill category</option>
                <option value="Care Under Fire">Care Under Fire</option>
                <option value="Tactical Field Care">Tactical Field Care</option>
                <option value="Tactical Evacuation">Tactical Evacuation</option>
              </select>
            </div>

            {skillCategory && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Skill</label>
                <select
                  value={skill}
                  onChange={(e) => handleSkillChange(e.target.value)}
                  disabled={isAssigning}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select skill</option>
                  {availableSkills.map((skillOption) => (
                    <option key={skillOption} value={skillOption}>
                      {skillOption}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {skill && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course Level</label>
                <select
                  value={courseLevel}
                  onChange={(e) => handleCourseLevelChange(e.target.value)}
                  disabled={isAssigning}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            )}

            {courseLevel && availableCourses.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  disabled={isAssigning}
                  className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                  <option value="">Select a course</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedCourse && (
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                  {skillCategory}
                </span>
                <span className="px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-medium">
                  {courseLevel}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={isAssigning}
                className="w-full px-4 py-2 rounded-md bg-input text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              />
            </div>

            {isAssigning && (
              <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Assigning course...</p>
                    <p className="text-xs text-muted-foreground">Updating records and sending notifications</p>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleAssignCourse}
              disabled={isAssigning || selectedTrainees.length === 0 || !selectedCourse}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-6"
            >
              {isAssigning ? "Assigning..." : "Assign to Selected Trainees"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
