import { Editor } from "primereact/editor";

const InputEditor = ({ text, setText }) => {
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
        theme="bubble"
        value={text}
        placeholder="Input text or paste images here... Press Cmd/Ctrl + Enter to send"
        onTextChange={(e) => setText(e.htmlValue || "")}
        style={{ minHeight: "150px" }}
        headerTemplate={header}
      />
    </div>
  );
};

export default InputEditor;
