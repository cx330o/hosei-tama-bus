import { Send, LogOut, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../stores/authStore"
import type { ConnectionStatus } from "../hooks/useWebSocket"

interface TopBarProps {
  connectionStatus?: ConnectionStatus
}

const TopBar = ({ connectionStatus = "connected" }: TopBarProps) => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const statusConfig = {
    connected: { color: "emerald", label: "Connected", pulse: true },
    connecting: { color: "amber", label: "Connecting...", pulse: true },
    disconnected: { color: "red", label: "Disconnected", pulse: false },
  }

  const s = statusConfig[connectionStatus]

  return (
    <div className="flex items-center justify-between px-4 py-5 mb-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/20">
          <Send size={18} className="text-indigo-400" />
        </div>
        <div>
          <span className="text-lg font-semibold tracking-tight dark:text-white text-gray-900">FastSend</span>
          <p className="text-xs text-gray-500">Cross-device clipboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-${s.color}-500/10 border border-${s.color}-500/20`}>
          <div className={`w-1.5 h-1.5 rounded-full bg-${s.color}-400 ${s.pulse ? "animate-pulse" : ""}`} />
          <span className={`text-xs text-${s.color}-400`}>{s.label}</span>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          title="Settings"
        >
          <Settings size={16} />
        </button>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  )
}

export default TopBar
