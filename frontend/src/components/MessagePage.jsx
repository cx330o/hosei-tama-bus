import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle } from "lucide-react";
import MessageList from "./MessageList";
import messageService from "../services/message";
import useWebSocket from "../hooks/useWebSocket";
import Input from "./Input";
import TopBar from "./TopBar";

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = (cursor) => {
    setLoading(true);
    setError(null);
    messageService.getAll({ cursor })
      .then((result) => {
        if (cursor) { setMessages((prev) => [...prev, ...result.messages]); }
        else { setMessages(result.messages); }
        setNextCursor(result.nextCursor);
        setHasMore(result.hasMore);
      })
      .catch(() => setError("Failed to load messages. Is the server running?"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);
  const loadMore = () => { if (!nextCursor || loading) return; fetchMessages(nextCursor); };
  const handleNewMessage = useCallback((newMessage) => { setMessages((prevMessages) => [newMessage, ...prevMessages]); }, []);
  useWebSocket(handleNewMessage);
  const handleDeleteMessage = (messageId) => { setMessages(messages.filter((message) => message.message_id !== messageId)); };

  return (
    <div className="flex flex-col w-full px-2 sm:px-0 sm:max-w-md md:max-w-lg lg:max-w-xl text-[#e5e7eb]">
      <TopBar />
      <Input />
      {error && (
        <div className="mx-2 mb-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle size={18} className="text-red-400 flex-none" />
          <div className="flex-auto"><p className="text-sm text-red-300">{error}</p></div>
          <button onClick={() => fetchMessages()} className="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors flex-none">Retry</button>
        </div>
      )}
      {loading && messages.length === 0 && !error && (<div className="text-center py-8 text-gray-500 text-sm">Loading messages...</div>)}
      {!loading && !error && messages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">No messages yet</p>
          <p className="text-gray-600 text-xs mt-1">Send a message, paste an image, or drag files to get started</p>
        </div>
      )}
      <MessageList messages={messages} onDeleteMessage={handleDeleteMessage} />
      {hasMore && (
        <button onClick={loadMore} disabled={loading} className="load-more-btn mx-2 my-4 px-4 py-2.5 text-sm text-gray-400 bg-[#1a1a1a] rounded-xl border border-gray-800/40 disabled:opacity-50">
          {loading ? "Loading..." : "Load more messages"}
        </button>
      )}
    </div>
  );
};

export default MessagesPage;
