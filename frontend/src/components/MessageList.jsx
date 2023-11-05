import Message from "./Message";

const MessageList = ({ messages, onDeleteMessage }) => {
  return (
    <div className="flex flex-col ">
      {messages.map((message) => (
        <Message key={message.message_id} message={message} onDeleteMessage={onDeleteMessage} />
      ))}
    </div>
  );
};

export default MessageList;
