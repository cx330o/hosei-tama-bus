import { useState } from "react"
import { Sparkles, Languages, Loader2 } from "lucide-react"
import FormattedDateTime from "./FormattedDateTime"
import MessageOptionsDropdown from "./MessageOptionsDropdown"
import MessageFiles from "./MessageFiles"
import MessageText from "./MessageText"
import messageService from "../services/message"
import { summarize, translate } from "../services/ai"
import toast, { Toaster } from "react-hot-toast"
import type { Message as MessageType } from "../types"

interface MessageProps {
  message: MessageType
  onDeleteMessage: (messageId: number) => void
}

const Message = ({ message, onDeleteMessage }: MessageProps) => {
  const [summary, setSummary] = useState<string | null>(null)
  const [translation, setTranslation] = useState<string | null>(null)
  const [aiLoading, setAiLoading] = useState<string | null>(null)

  const handleDelete = async () => {
    try {
      await messageService.deleteMessage(message.message_id)
      toast.success("Message deleted successfully")
      onDeleteMessage(message.message_id)
    } catch (error) {
      console.error("Error deleting message:", error)
      toast.error("Failed to delete message")
    }
  }

  const handleSummarize = async () => {
    if (summary) { setSummary(null); return }
    setAiLoading("summarize")
    try {
      const result = await summarize(message.message_id)
      setSummary(result)
    } catch {
      toast.error("Failed to generate summary")
    } finally {
      setAiLoading(null)
    }
  }

  const handleTranslate = async () => {
    if (translation) { setTranslation(null); return }
    setAiLoading("translate")
    try {
      const result = await translate(message.message_id)
      setTranslation(result)
    } catch {
      toast.error("Failed to translate")
    } finally {
      setAiLoading(null)
    }
  }

  const hasText = message.message_text && message.message_text.replace(/<[^>]*>/g, "").trim().length > 0

  return (
    <div className="message-card animate-fade-in p-4 mx-2 mb-3 dark:bg-[#1a1a1a] bg-white rounded-xl border dark:border-gray-800/40 border-gray-200 hover:border-gray-700/60">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-2">
        <FormattedDateTime dateTime={message.message_creation_time} />
        <div className="flex items-center gap-1">
          {hasText && (
            <>
              <button
                onClick={handleSummarize}
                disabled={aiLoading !== null}
                className={`p-1.5 rounded-md transition-colors ${summary ? "text-indigo-400 bg-indigo-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                title="Summarize"
              >
                {aiLoading === "summarize" ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              </button>
              <button
                onClick={handleTranslate}
                disabled={aiLoading !== null}
                className={`p-1.5 rounded-md transition-colors ${translation ? "text-indigo-400 bg-indigo-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
                title="Translate"
              >
                {aiLoading === "translate" ? <Loader2 size={14} className="animate-spin" /> : <Languages size={14} />}
              </button>
            </>
          )}
          <MessageOptionsDropdown onDelete={handleDelete} />
        </div>
      </div>
      <MessageText text={message.message_text} />
      {summary && (
        <div className="mt-2 p-3 rounded-lg dark:bg-indigo-500/5 bg-indigo-50 border dark:border-indigo-500/10 border-indigo-200">
          <p className="text-xs font-medium text-indigo-400 mb-1">AI Summary</p>
          <p className="text-sm dark:text-gray-300 text-gray-700">{summary}</p>
        </div>
      )}
      {translation && (
        <div className="mt-2 p-3 rounded-lg dark:bg-emerald-500/5 bg-emerald-50 border dark:border-emerald-500/10 border-emerald-200">
          <p className="text-xs font-medium text-emerald-400 mb-1">Translation</p>
          <p className="text-sm dark:text-gray-300 text-gray-700">{translation}</p>
        </div>
      )}
      <MessageFiles files={message.message_files} />
    </div>
  )
}

export default Message
