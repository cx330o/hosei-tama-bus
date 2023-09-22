import React, { useState } from "react";
import { FileText, Film, Music } from "lucide-react";

function getFileType(file) {
  const type = file.type || file.file_type || "";
  if (type.startsWith("image/")) return "image";
  if (type.startsWith("video/")) return "video";
  if (type.startsWith("audio/")) return "audio";
  return "other";
}

function getFileUrl(file, fileUrlBase) {
  if (fileUrlBase && file.file_name) return fileUrlBase + file.file_name;
  if (file instanceof File || file instanceof Blob)
    return URL.createObjectURL(file);
  return null;
}

function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const FileItem = React.memo(({ file, fileUrlBase = "" }) => {
  const fileType = getFileType(file);
  const fileUrl = getFileUrl(file, fileUrlBase);
  const fileName = file.file_original_name || file.name;
  const fileSize = file.file_size || file.size;

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileUrl}
            alt={fileName}
            className="w-12 h-12 rounded-lg object-cover object-center ring-1 ring-gray-700"
          />
        );
      case "video":
        return (
          <div className="w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 flex items-center justify-center">
            <Film size={20} className="text-gray-400" />
          </div>
        );
      case "audio":
        return (
          <div className="w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 flex items-center justify-center">
            <Music size={20} className="text-gray-400" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-gray-800 ring-1 ring-gray-700 flex items-center justify-center">
            <FileText size={20} className="text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex-none">{renderPreview()}</div>
      <div className="flex flex-col flex-auto overflow-hidden min-w-0">
        <span className="truncate text-sm text-gray-300">{fileName}</span>
        {fileSize && (
          <span className="text-xs text-gray-500 mt-0.5">
            {formatFileSize(fileSize)}
          </span>
        )}
      </div>
    </div>
  );
});

export default FileItem;
