import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  login: (code: string) => void
  logout: () => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      login: (code: string) => {
        const token = btoa(`${code}:`)
        set({ token, isAuthenticated: true })
      },
      logout: () => {
        set({ token: null, isAuthenticated: false })
      },
    }),
    {
      name: "fastsend-auth",
    }
  )
)

export default useAuthStore
