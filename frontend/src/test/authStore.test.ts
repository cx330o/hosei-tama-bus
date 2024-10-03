import { describe, it, expect, beforeEach } from "vitest"
import { act } from "@testing-library/react"
import useAuthStore from "../stores/authStore"

describe("authStore", () => {
  beforeEach(() => {
    act(() => {
      useAuthStore.getState().logout()
    })
  })

  it("starts with no authentication", () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
  })

  it("login sets token and isAuthenticated", () => {
    act(() => {
      useAuthStore.getState().login("testcode")
    })
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(true)
    expect(state.token).toBe(btoa("testcode:"))
  })

  it("logout clears token and isAuthenticated", () => {
    act(() => {
      useAuthStore.getState().login("testcode")
    })
    act(() => {
      useAuthStore.getState().logout()
    })
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.token).toBeNull()
  })
})
