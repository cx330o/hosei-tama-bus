import toast, { Toaster } from "react-hot-toast";
import { Button } from "primereact/button";
import FileItem from "./FileItem";

const MessageFileItem = ({ file }) => {
  const fileUrlBase = `${import.meta.env.VITE_API_BASE_URL}/api/files/`;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const isImage = file.file_type.startsWith("image/");
  const isAudio = file.file_type.startsWith("audio/");

  const handleCopyClick = async () => {
    if (!isImage) {
      toast.error("Only images can be copied to clipboard");
      return;
    }

    try {
      const imageResponse = await fetch(
        `${baseUrl}/api/files/${file.file_name}`
      );
      const imageBlob = await imageResponse.blob();

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = await createImageBitmap(imageBlob);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(async (blob) => {
        if (window.ClipboardItem) {
          const clipboardItem = new ClipboardItem({ "image/png": blob });
          await navigator.clipboard.write([clipboardItem]);
          toast.success("Image copied to clipboard");
        } else {
          toast.error("Clipboard API not supported (HTTPS may be required)");
        }
      }, "image/png");
    } catch (err) {
      console.error("Copy failed: ", err);
      toast.error("Failed to copy image");
    }
  };

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = `${baseUrl}/api/files/${file.file_name}`;
    link.download = file.file_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  return (
    <div className="m-1">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center gap-2">
        <FileItem file={file} fileUrlBase={fileUrlBase} />
        {isImage && (
          <div className="flex-none">
            <Button icon="pi pi-copy" text onClick={handleCopyClick} />
          </div>
        )}
        <div className="flex-none">
          <Button
            icon="pi pi-arrow-circle-down"
            text
            onClick={handleDownloadClick}
          />
        </div>
      </div>
      {isAudio && (
        <audio
          src={`${fileUrlBase}${file.file_name}`}
          controls
          className="w-full mt-2 h-10 rounded-lg"
          preload="metadata"
        />
      )}
    </div>
  );
};

export default MessageFileItem;
