import { Button } from "primereact/button";

const InputFileItem = ({ file, onRemove }) => {
  const handleRemoveClick = () => {
    onRemove(file);
  };

  return (
    <div className="flex gap-2 m-1 items-center">
      <span className="text-sm text-gray-300 truncate">{file.name}</span>
      <div className="flex-none">
        <Button icon="pi pi-trash " text onClick={handleRemoveClick}></Button>
      </div>
    </div>
  );
};

export default InputFileItem;
