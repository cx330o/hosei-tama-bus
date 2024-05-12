import { useState, useRef } from "react";
import { Button } from "primereact/button";

const InputToolbar = ({ onFilesSelected, onSend }) => {
  const fileInputRef = useRef();
  const [isSending, setIsSending] = useState(false);

  const handleUploadClick = () => { fileInputRef.current.click(); };

  const handleSend = async () => {
    setIsSending(true);
    try { await onSend(); } finally { setIsSending(false); }
  };

  return (
    <div className="flex justify-between gap-2 m-2 card">
      <input type="file" multiple style={{ display: "none" }} ref={fileInputRef} onChange={onFilesSelected} />
      <Button label="Upload" icon="pi pi-plus" text raised onClick={handleUploadClick} />
      <Button label="Send" icon="pi pi-upload" iconPos="right" onClick={handleSend} disabled={isSending} />
    </div>
  );
};

export default InputToolbar;
