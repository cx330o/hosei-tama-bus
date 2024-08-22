import MessageFileItem from "./MessageFileItem"
import type { MessageFile } from "../types"

interface MessageFilesProps {
  files: MessageFile[]
}

const MessageFiles = ({ files }: MessageFilesProps) => {
  return (
    <div className="flex flex-col">
      {files.map((file, index) => (
        <MessageFileItem key={index} file={file} />
      ))}
    </div>
  )
}

export default MessageFiles
