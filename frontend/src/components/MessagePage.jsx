import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import messageService from "../services/message";
import Input from "./Input";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = (cursor) => {
    setLoading(true);
    setError(null);
    messageService
      .getAll({ cursor })
      .then((result) => {
        if (cursor) {
          setMessages((prev) => [...prev, ...result.messages]);
        } else {
          setMessages(result.messages);
        }
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      })
      .catch(() => setError("Failed to load messages. Is the server running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const loadMore = () => {
    if (!nextCursor || loading) return;
    fetchMessages(nextCursor);
  };

  return (
    <div className="flex flex-col w-full px-2 text-[#e5e7eb]">
      <h1 className="text-lg font-bold p-4">FastSend</h1>
      <Input />
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
      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mx-2 my-4 px-4 py-2.5 text-sm text-gray-400 bg-[#1a1a1a] rounded-xl border border-gray-800/40 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load more messages"}
        </button>
      )}
    </div>
  );
};

export default MessagesPage;
