const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col">
      {messages.map((message) => (
        <div key={message.message_id} className="p-3 mb-2 bg-[#1a1a1a] rounded-lg">
          <p className="text-xs text-gray-500">{message.message_creation_time}</p>
          <p>{message.message_text}</p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
