import Message from "./Message"
import type { Message as MessageType } from "../types"

interface MessageListProps {
  messages: MessageType[]
  onDeleteMessage: (messageId: number) => void
}

const MessageList = ({ messages, onDeleteMessage }: MessageListProps) => {
  return (
    <div className="flex flex-col ">
      {messages.map((message) => (
        <Message key={message.message_id} message={message} onDeleteMessage={onDeleteMessage} />
      ))}
    </div>
  )
}

export default MessageList
