import React, { useRef } from "react";
import { Editor } from "primereact/editor";

const MessageText = ({ text }) => {
  const editorRef = useRef(null);

  return (
    <div className="relative py-1">
      {text && (
        <Editor ref={editorRef} value={text} readOnly theme="bubble" />
      )}
    </div>
  );
};

export default MessageText;
