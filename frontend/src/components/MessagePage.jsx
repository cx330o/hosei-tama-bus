import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
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
      <MessageList messages={messages} />
    </div>
  );
};

export default MessagesPage;
