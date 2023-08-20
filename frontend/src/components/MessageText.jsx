import React, { useRef, useState } from "react";
import { Editor } from "primereact/editor";
import { Copy, Check } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

const MessageText = ({ text }) => {
  const editorRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const editor = editorRef.current.getQuill();
    const length = editor.getLength();
    editor.setSelection(0, length);

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(editor.getText());
      } else {
        const textarea = document.createElement("textarea");
        document.body.appendChild(textarea);
        textarea.value = editor.getText();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Text copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy text");
    }

    editor.setSelection(null);
  };

  return (
    <div className="relative py-1">
      <Toaster position="top-center" reverseOrder={false} />
      {text && (
        <>
          <Editor ref={editorRef} value={text} readOnly theme="bubble" />
          <Tippy content={copied ? "Copied!" : "Copy text"}>
            <button
              onClick={copyToClipboard}
              className={`absolute right-0 top-4 transition-colors ${
                copied
                  ? "text-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </Tippy>
        </>
      )}
    </div>
  );
};

export default MessageText;
