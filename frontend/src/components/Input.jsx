import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import InputEditor from "./InputEditor";
import InputToolbar from "./InputToolbar";
import messageService from "../services/message";

const Input = () => {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const handleFilesSelect = (event) => {
    setFiles((prev) => [...prev, ...Array.from(event.target.files)]);
  };

  const handleSend = async () => {
    const hasText = text.replace(/<[^>]*>/g, "").trim().length > 0;
    const hasFiles = files.length > 0;

    if (!hasText && !hasFiles) {
      toast.error("Please add some text or files before sending");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", hasText ? text : "");
      files.forEach((file) => {
        formData.append("files", file);
      });
      const newMessage = await messageService.create(formData);
      if (newMessage) {
        setText("");
        setFiles([]);
      }
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="mx-2 mb-4 bg-[#1a1a1a] rounded-xl border border-gray-800/40 overflow-hidden">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="p-4">
        <InputEditor text={text} setText={setText} onSend={handleSend} />
      </div>
      <div className="border-t border-gray-800/30">
        <InputToolbar onFilesSelected={handleFilesSelect} onSend={handleSend} />
      </div>
    </div>
  );
};

export default Input;
