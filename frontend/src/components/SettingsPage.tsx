import { useNavigate } from "react-router-dom"
import { ArrowLeft, Sun, Moon } from "lucide-react"
import useThemeStore from "../stores/themeStore"

const SettingsPage = () => {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="flex justify-center min-h-screen bg-[#0e0e0e] dark:bg-[#0e0e0e] bg-gray-50">
      <div className="flex flex-col w-full px-2 sm:px-0 sm:max-w-md md:max-w-lg lg:max-w-xl text-[#e5e7eb] dark:text-[#e5e7eb] text-gray-800">
        <div className="flex items-center gap-3 px-4 py-5 mb-2">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-lg font-semibold dark:text-white text-gray-900">Settings</span>
        </div>

        <div className="mx-2 p-4 dark:bg-[#1a1a1a] bg-white rounded-xl border dark:border-gray-800/40 border-gray-200">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon size={18} className="text-gray-400" />
              ) : (
                <Sun size={18} className="text-amber-500" />
              )}
              <span className="text-sm dark:text-gray-300 text-gray-700">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 text-xs rounded-lg dark:bg-gray-800 bg-gray-100 dark:text-gray-300 text-gray-600 hover:opacity-80 transition-opacity"
            >
              Switch to {theme === "dark" ? "light" : "dark"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
