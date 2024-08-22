import React, { useState } from "react"
import ImageModal from "./ImageModal"
import { FileText, Film, Music } from "lucide-react"
import type { MessageFile } from "../types"

type FileInput = MessageFile | File

function getFileType(file: FileInput): string {
  const type = "file_type" in file ? file.file_type : file.type || ""
  if (type.startsWith("image/")) return "image"
  if (type.startsWith("video/")) return "video"
  if (type.startsWith("audio/")) return "audio"
  return "other"
}

function getFileUrl(file: FileInput, fileUrlBase: string): string | null {
  if (fileUrlBase && "file_name" in file) return fileUrlBase + file.file_name
  if (file instanceof File || file instanceof Blob)
    return URL.createObjectURL(file)
  return null
}

function formatFileSize(bytes: number | undefined): string | null {
  if (!bytes && bytes !== 0) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface FileItemProps {
  file: FileInput
  fileUrlBase?: string
}

const FileItem = React.memo(({ file, fileUrlBase = "" }: FileItemProps) => {
  const fileType = getFileType(file)
  const fileUrl = getFileUrl(file, fileUrlBase)
  const fileName = "file_original_name" in file ? file.file_original_name : (file as File).name
  const fileSize = "file_size" in file ? file.file_size : (file as File).size

  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <>
            <img
              src={fileUrl!}
              alt={fileName}
              onClick={toggleModal}
              className="w-12 h-12 rounded-lg object-cover object-center cursor-pointer ring-1 ring-gray-700 hover:ring-indigo-500/50 transition-all"
            />
            <ImageModal
              isOpen={isModalOpen}
              imageUrl={fileUrl!}
              alt={fileName}
              onClick={toggleModal}
            />
          </>
        )
      case "video":
        return (
          <div
            onClick={toggleModal}
            className="relative w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 hover:ring-indigo-500/50 cursor-pointer flex items-center justify-center transition-all overflow-hidden"
          >
            <Film size={20} className="text-gray-400" />
            {isModalOpen && (
              <div
                className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleModal()
                }}
              >
                <video
                  src={fileUrl!}
                  controls
                  autoPlay
                  className="max-w-[90vw] max-h-[80vh] rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        )
      case "audio":
        return (
          <div className="w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 flex items-center justify-center">
            <Music size={20} className="text-gray-400" />
          </div>
        )
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 flex items-center justify-center">
            <FileText size={20} className="text-gray-400" />
          </div>
        )
    }
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex-none">{renderPreview()}</div>
      <div className="flex flex-col flex-auto overflow-hidden min-w-0">
        <span className="truncate text-sm text-gray-300">{fileName}</span>
        <span className="text-xs text-gray-500 mt-0.5">
          {[formatFileSize(fileSize), fileType === "video" ? "Click to play" : null]
            .filter(Boolean)
            .join(" · ")}
        </span>
      </div>
    </div>
  )
})

export default FileItem
