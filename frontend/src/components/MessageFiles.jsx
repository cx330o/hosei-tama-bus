import MessageFileItem from "./MessageFileItem";

const MessageFiles = ({files}) => {
  return ( 
    <div className="flex flex-col">
      {files.map((file, index) => (
        <MessageFileItem key={index} file={file} />
      ))}
    </div>
   );
}
 
export default MessageFiles;
