import React, { useState } from "react";

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

const FileItem = React.memo(({ file, fileUrlBase = "" }) => {
  const fileType = getFileType(file);
  const fileUrl = getFileUrl(file, fileUrlBase);
  const fileName = file.file_original_name || file.name;

  const renderPreview = () => {
    if (fileType === "image") {
      return (
        <img
          src={fileUrl}
          alt={fileName}
          className="w-12 h-12 rounded-lg object-cover object-center"
        />
      );
    }
    return (
      <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 text-xs">
        FILE
      </div>
    );
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
      <div className="flex-none">{renderPreview()}</div>
      <span className="truncate text-sm text-gray-300">{fileName}</span>
    </div>
  );
});

export default FileItem;
