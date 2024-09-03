import { BrowserRouter, Routes, Route } from "react-router-dom"
import MessagePage from "./components/MessagePage"
import LoginPage from "./components/LoginPage"
import SettingsPage from "./components/SettingsPage"
import ProtectedRoute from "./components/ProtectedRoute"
import "./App.css"

const App = () => {
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
            <div className="flex justify-center min-h-screen bg-[#0e0e0e]">
              <MessagePage />
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
