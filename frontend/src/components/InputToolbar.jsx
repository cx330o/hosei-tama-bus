import { useRef } from "react";
import { Button } from "primereact/button";

const InputToolbar = ({ onFilesSelected, onSend }) => {
  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="flex justify-between gap-2 m-2 card">
      <input
        type="file"
        multiple
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFilesSelected}
      />
      <Button
        label="Upload"
        icon="pi pi-plus"
        text
        raised
        onClick={handleUploadClick}
      />
      <Button
        label="Send"
        icon="pi pi-upload"
        iconPos="right"
        onClick={onSend}
      />
    </div>
  );
};

export default InputToolbar;
