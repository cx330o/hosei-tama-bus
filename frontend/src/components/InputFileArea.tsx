import InputFileItem from "./InputFileItem"

interface InputFileAreaProps {
  files: File[]
  onRemoveFile: (file: File) => void
}

const InputFileArea = ({ files, onRemoveFile }: InputFileAreaProps) => {
  return (
    <div className="flex-col m-2">
      {files.map((file, index) => (
        <InputFileItem key={index} file={file} onRemove={onRemoveFile} />
      ))}
    </div>
  )
}

export default InputFileArea
