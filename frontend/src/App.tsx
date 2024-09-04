import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import MessagePage from "./components/MessagePage"
import LoginPage from "./components/LoginPage"
import SettingsPage from "./components/SettingsPage"
import ProtectedRoute from "./components/ProtectedRoute"
import useThemeStore from "./stores/themeStore"
import "./App.css"

const App = () => {
  const theme = useThemeStore((state) => state.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="flex justify-center min-h-screen dark:bg-[#0e0e0e] bg-gray-50">
              <MessagePage />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
