import { useState } from "react";
import messageService from "../services/message";

const Input = () => {
  const [text, setText] = useState("");

  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const formData = new FormData();
      formData.append("text", text);
      await messageService.create(formData);
      setText("");
    } catch (err) {
      console.error("Failed to send:", err);
    }
  };

  return (
    <div className="mx-2 mb-4 bg-[#1a1a1a] rounded-xl border border-gray-800/40 p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="w-full bg-transparent text-gray-200 resize-none outline-none"
        rows={3}
      />
      <button
        onClick={handleSend}
        className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
      >
        Send
      </button>
    </div>
  );
};

export default Input;
