const Message = ({ message }) => {
  return (
    <div className="p-4 mx-2 mb-3 bg-[#1a1a1a] rounded-xl border border-gray-800/40">
      <p className="text-xs text-gray-500 mb-2">{message.message_creation_time}</p>
      <p>{message.message_text}</p>
    </div>
  );
};

export default Message;
