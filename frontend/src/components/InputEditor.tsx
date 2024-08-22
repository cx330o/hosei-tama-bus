import { useState, ClipboardEvent, KeyboardEvent } from "react"
import { Editor } from "primereact/editor"

interface InputEditorProps {
  text: string
  setText: (text: string) => void
  onPaste: (event: ClipboardEvent) => void
  onSend: () => void
}

const InputEditor = ({ text, setText, onPaste, onSend }: InputEditorProps) => {
  const [key, setKey] = useState(0)

  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      onSend()
      setKey((prevKey) => prevKey + 1)
    }
  }

  const header = (
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
    </span>
  )

  return (
    <div className="card">
      <Editor
        key={key}
        theme="bubble"
        value={text}
        placeholder="Input text or paste images here... Press Cmd/Ctrl + Enter to send"
        onTextChange={(e) => setText(e.htmlValue || "")}
        onPaste={onPaste as any}
        onKeyDown={handleKeyDown as any}
        style={{ minHeight: "150px" }}
        headerTemplate={header}
      />
    </div>
  )
}

export default InputEditor
