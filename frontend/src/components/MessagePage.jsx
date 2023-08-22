import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import messageService from "../services/message";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    setError(null);
    messageService
      .getAll()
      .then((result) => {
        setMessages(result.messages);
      })
      .catch(() => setError("Failed to load messages. Is the server running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <div className="flex flex-col w-full px-2 text-[#e5e7eb]">
      <h1 className="text-lg font-bold p-4">FastSend</h1>
      {error && (
        <div className="mx-2 mb-3 p-3 rounded-lg bg-red-500/10 text-red-300 text-sm">
          {error}
        </div>
      )}
      {loading && messages.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500 text-sm">
          Loading messages...
        </div>
      )}
      {!loading && !error && messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No messages yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Send a message to get started
          </p>
        </div>
      )}
      <MessageList messages={messages} />
    </div>
  );
};

export default MessagesPage;
