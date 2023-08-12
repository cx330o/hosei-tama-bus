import React, { useState, useEffect } from "react";
import messageService from "../services/message";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = () => {
    setLoading(true);
    messageService
      .getAll()
      .then((result) => {
        setMessages(result.messages);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col w-full px-2 text-[#e5e7eb]">
      <h1 className="text-lg font-bold p-4">FastSend</h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {messages.map((msg) => (
        <div key={msg.message_id} className="p-3 mb-2 bg-[#1a1a1a] rounded-lg">
          <p className="text-xs text-gray-500">{msg.message_creation_time}</p>
          <p>{msg.message_text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessagesPage;
