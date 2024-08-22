import { Button } from "primereact/button"
import FileItem from "./FileItem"

interface InputFileItemProps {
  file: File
  onRemove: (file: File) => void
}

const InputFileItem = ({ file, onRemove }: InputFileItemProps) => {
  const handleRemoveClick = () => {
    onRemove(file)
  }

  return (
    <div className="flex gap-2 m-1 file-item">
      <FileItem file={file} />
      <div className="flex-none">
        <Button icon="pi pi-trash" text onClick={handleRemoveClick} />
      </div>
    </div>
  )
}

export default InputFileItem
