import { useState, DragEvent, ClipboardEvent } from "react"
import toast, { Toaster } from "react-hot-toast"
import InputEditor from "./InputEditor"
import InputFileArea from "./InputFileArea"
import InputToolbar from "./InputToolbar"
import messageService from "../services/message"

const Input = () => {
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [dragging, setDragging] = useState(false)

  const handleFilesSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles((prev) => [...prev, ...Array.from(event.target.files!)])
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    setFiles(files.filter((file) => file !== fileToRemove))
  }

  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData.items
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile()
        if (file) setFiles((prev) => [...prev, file])
        event.preventDefault()
      }
    }
  }

  const handleDragOver = (e: DragEvent) => { e.preventDefault(); setDragging(true) }
  const handleDragLeave = (e: DragEvent) => { e.preventDefault(); setDragging(false) }
  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    if (droppedFiles.length > 0) setFiles((prev) => [...prev, ...droppedFiles])
  }

  const handleSend = async () => {
    const hasText = text.replace(/<[^>]*>/g, "").trim().length > 0
    const hasFiles = files.length > 0
    if (!hasText && !hasFiles) { toast.error("Please add some text or files before sending"); return }
    try {
      const formData = new FormData()
      formData.append("text", hasText ? text : "")
      files.forEach((file) => { formData.append("files", file) })
      const newMessage = await messageService.create(formData)
      if (newMessage) { setText(""); setFiles([]) }
    } catch { toast.error("Failed to send message") }
  }

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      className={`mx-2 mb-4 bg-[#1a1a1a] rounded-xl border transition-colors duration-200 overflow-hidden ${
        dragging ? "border-indigo-500 bg-indigo-500/5" : "border-gray-800/40 hover:border-indigo-500/40 focus-within:border-indigo-500/60"
      }`}>
      <Toaster position="top-center" reverseOrder={false} />
      {dragging && (<div className="px-4 py-3 text-center text-sm text-indigo-400 bg-indigo-500/10 border-b border-indigo-500/20">Drop files here to upload</div>)}
      <div className="p-4"><InputEditor text={text} setText={setText} onPaste={handlePaste} onSend={handleSend} /></div>
      <InputFileArea files={files} onRemoveFile={handleRemoveFile} />
      <div className="border-t border-gray-800/30"><InputToolbar onFilesSelected={handleFilesSelect} onSend={handleSend} /></div>
    </div>
  )
}

export default Input
