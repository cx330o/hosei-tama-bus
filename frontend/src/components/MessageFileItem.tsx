import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { Button } from "primereact/button"
import FileItem from "./FileItem"
import { describeImage } from "../services/ai"
import type { MessageFile } from "../types"

interface MessageFileItemProps {
  file: MessageFile
}

const MessageFileItem = ({ file }: MessageFileItemProps) => {
  const fileUrlBase = `${import.meta.env.VITE_API_BASE_URL}/api/files/`
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const isImage = file.file_type.startsWith("image/")
  const isAudio = file.file_type.startsWith("audio/")
  const [description, setDescription] = useState<string | null>(null)
  const [describing, setDescribing] = useState(false)

  const handleCopyClick = async () => {
    if (!isImage) { toast.error("Only images can be copied to clipboard"); return }
    try {
      const imageResponse = await fetch(`${baseUrl}/api/files/${file.file_name}`)
      const imageBlob = await imageResponse.blob()
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = await createImageBitmap(imageBlob)
      canvas.width = img.width; canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(async (blob) => {
        if (blob && window.ClipboardItem) {
          const clipboardItem = new ClipboardItem({ "image/png": blob })
          await navigator.clipboard.write([clipboardItem])
          toast.success("Image copied to clipboard")
        } else { toast.error("Clipboard API not supported (HTTPS may be required)") }
      }, "image/png")
    } catch (err) { console.error("Copy failed: ", err); toast.error("Failed to copy image") }
  }

  const handleDownloadClick = () => {
    const link = document.createElement("a")
    link.href = `${baseUrl}/api/download/${file.file_name}`
    link.download = file.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Download started")
  }

  const handleDescribe = async () => {
    if (description) { setDescription(null); return }
    setDescribing(true)
    try {
      const result = await describeImage(file.file_name)
      setDescription(result)
    } catch {
      toast.error("Failed to describe image")
    } finally {
      setDescribing(false)
    }
  }

  return (
    <div className="m-1">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center gap-2">
        <FileItem file={file} fileUrlBase={fileUrlBase} />
        {isImage && (
          <>
            <div className="flex-none"><Button icon="pi pi-copy" text onClick={handleCopyClick} /></div>
            <button
              onClick={handleDescribe}
              disabled={describing}
              className={`p-1.5 rounded-md transition-colors flex-none ${description ? "text-indigo-400 bg-indigo-500/10" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`}
              title="Describe image with AI"
            >
              {describing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            </button>
          </>
        )}
        <div className="flex-none"><Button icon="pi pi-arrow-circle-down" text onClick={handleDownloadClick} /></div>
      </div>
      {description && (
        <div className="mt-2 p-3 rounded-lg dark:bg-indigo-500/5 bg-indigo-50 border dark:border-indigo-500/10 border-indigo-200">
          <p className="text-xs font-medium text-indigo-400 mb-1">AI Description</p>
          <p className="text-sm dark:text-gray-300 text-gray-700">{description}</p>
        </div>
      )}
      {isAudio && (<audio src={`${fileUrlBase}${file.file_name}`} controls className="w-full mt-2 h-10 rounded-lg" preload="metadata" />)}
    </div>
  )
}

export default MessageFileItem
