import Message from "./Message";

const MessageList = ({ messages }) => {
  return (
    <div className="flex flex-col ">
      {messages.map((message) => (
        <Message key={message.message_id} message={message} />
      ))}
    </div>
  );
};

export default MessageList;
