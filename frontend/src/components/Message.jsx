import FormattedDateTime from "./FormattedDateTime";
import MessageText from "./MessageText";

const Message = ({ message }) => {
  return (
    <div className="p-4 mx-2 mb-3 bg-[#1a1a1a] rounded-xl border border-gray-800/40">
      <div className="mb-2">
        <FormattedDateTime dateTime={message.message_creation_time} />
      </div>
      <MessageText text={message.message_text} />
    </div>
  );
};

export default Message;
