import { useState } from "react";
import { Editor } from "primereact/editor";

const InputEditor = ({ text, setText, onSend }) => {
  const [key, setKey] = useState(0);

  const handleKeyDown = (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      onSend();
      // Force re-render to clear editor content after Ctrl+Enter send
      setKey((prevKey) => prevKey + 1);
    }
  };

  const header = (
    <span className="ql-formats">
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <button className="ql-list" value="ordered"></button>
      <button className="ql-list" value="bullet"></button>
    </span>
  );

  return (
    <div className="card">
      <Editor
        key={key}
        theme="bubble"
        value={text}
        placeholder="Input text or paste images here... Press Cmd/Ctrl + Enter to send"
        onTextChange={(e) => setText(e.htmlValue || "")}
        onKeyDown={handleKeyDown}
        style={{ minHeight: "150px" }}
        headerTemplate={header}
      />
    </div>
  );
};

export default InputEditor;
