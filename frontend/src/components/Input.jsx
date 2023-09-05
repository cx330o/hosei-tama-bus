import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import InputEditor from "./InputEditor";
import messageService from "../services/message";

const Input = () => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    const hasText = text.replace(/<[^>]*>/g, "").trim().length > 0;
    if (!hasText) {
      toast.error("Please add some text before sending");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("text", text);
      const newMessage = await messageService.create(formData);
      if (newMessage) {
        setText("");
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
      <div className="border-t border-gray-800/30 p-2">
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Input;
