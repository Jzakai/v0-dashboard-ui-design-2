/** Key used with localStorage to remember the logged-in trainee's `users.user_id`. */
export const TRAINEE_ID_STORAGE_KEY = "currentTraineeId"

export function getStoredTraineeId(): string | null {
  if (typeof window === "undefined") return null
  const v = localStorage.getItem(TRAINEE_ID_STORAGE_KEY)?.trim()
  return v || null
}

export function setStoredTraineeId(userId: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(TRAINEE_ID_STORAGE_KEY, String(userId).trim())
}

export function clearStoredTraineeId(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(TRAINEE_ID_STORAGE_KEY)
}
