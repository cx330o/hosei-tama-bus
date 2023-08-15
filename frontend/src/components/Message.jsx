import FormattedDateTime from "./FormattedDateTime";

const Message = ({ message }) => {
  return (
    <div className="p-4 mx-2 mb-3 bg-[#1a1a1a] rounded-xl border border-gray-800/40">
      <div className="mb-2">
        <FormattedDateTime dateTime={message.message_creation_time} />
      </div>
      <p>{message.message_text}</p>
    </div>
  );
};

export default Message;
