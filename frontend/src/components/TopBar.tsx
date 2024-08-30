import { Send, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../stores/authStore"

const TopBar = () => {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex items-center justify-between px-4 py-5 mb-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/20">
          <Send size={18} className="text-indigo-400" />
        </div>
        <div>
          <span className="text-lg font-semibold tracking-tight text-white">FastSend</span>
          <p className="text-xs text-gray-500">Cross-device clipboard</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-emerald-400">Connected</span>
        </div>
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
