import { useState, useRef } from "react"
import { Button } from "primereact/button"

interface InputToolbarProps {
  onFilesSelected: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSend: () => Promise<void> | void
}

const InputToolbar = ({ onFilesSelected, onSend }: InputToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSending, setIsSending] = useState(false)

  const handleUploadClick = () => { fileInputRef.current?.click() }

  const handleSend = async () => {
    setIsSending(true)
    try { await onSend() } finally { setIsSending(false) }
  }

  return (
    <div className="flex justify-between gap-2 m-2 card">
      <input type="file" multiple style={{ display: "none" }} ref={fileInputRef} onChange={onFilesSelected} />
      <Button label="Upload" icon="pi pi-plus" text raised onClick={handleUploadClick} />
      <Button label="Send" icon="pi pi-upload" iconPos="right" onClick={handleSend} disabled={isSending} />
    </div>
  )
}

export default InputToolbar
