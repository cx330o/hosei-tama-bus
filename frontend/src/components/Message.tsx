import FormattedDateTime from "./FormattedDateTime"
import MessageOptionsDropdown from "./MessageOptionsDropdown"
import MessageFiles from "./MessageFiles"
import MessageText from "./MessageText"
import messageService from "../services/message"
import toast, { Toaster } from "react-hot-toast"
import type { Message as MessageType } from "../types"

interface MessageProps {
  message: MessageType
  onDeleteMessage: (messageId: number) => void
}

const Message = ({ message, onDeleteMessage }: MessageProps) => {
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

  return (
    <div className="message-card animate-fade-in p-4 mx-2 mb-3 bg-[#1a1a1a] rounded-xl border border-gray-800/40 hover:border-gray-700/60">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex justify-between items-center mb-2">
        <FormattedDateTime dateTime={message.message_creation_time} />
        <MessageOptionsDropdown onDelete={handleDelete} />
      </div>
      <MessageText text={message.message_text} />
      <MessageFiles files={message.message_files} />
    </div>
  )
}

export default Message
