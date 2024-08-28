import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Send } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import useAuthStore from "../stores/authStore"

const LoginPage = () => {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      toast.error("Please enter an access code")
      return
    }
    setLoading(true)
    try {
      login(code.trim())
      navigate("/")
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0e0e0e]">
      <Toaster position="top-center" />
      <div className="w-full max-w-sm mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 mb-4">
            <Send size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-semibold text-white">FastSend</h1>
          <p className="text-sm text-gray-500 mt-1">Enter access code to continue</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            autoFocus
            className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-800/40 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl text-white font-medium transition-colors"
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
