import { Button } from "primereact/button";
import FileItem from './FileItem'; 

const InputFileItem = ({ file, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(file);
  };

  return (
    <div className="flex gap-2 m-1 file-item">
      <FileItem file={file} />
      <div className="flex-none">
        <Button icon="pi pi-trash " text onClick={handleRemoveClick}></Button>
      </div>
    </div>
  );
};

export default InputFileItem;
