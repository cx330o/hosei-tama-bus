import { useNavigate } from "react-router-dom"
import { ArrowLeft, Sun, Moon } from "lucide-react"

interface SettingsPageProps {}

const SettingsPage = ({}: SettingsPageProps) => {
  const navigate = useNavigate()

  return (
    <div className="flex justify-center min-h-screen bg-[#0e0e0e]">
      <div className="flex flex-col w-full px-2 sm:px-0 sm:max-w-md md:max-w-lg lg:max-w-xl text-[#e5e7eb]">
        <div className="flex items-center gap-3 px-4 py-5 mb-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-lg font-semibold text-white">Settings</span>
        </div>

        <div className="mx-2 p-4 bg-[#1a1a1a] rounded-xl border border-gray-800/40">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gray-400" />
              <span className="text-sm text-gray-300">Dark mode</span>
            </div>
            <span className="text-xs text-gray-500 px-2 py-1 rounded bg-gray-800">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
