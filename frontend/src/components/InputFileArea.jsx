import InputFileItem from "./InputFileItem";

const InputFileArea = ({ files, onRemoveFile }) => {
  return (
    <div className="flex-col m-2">
      {files.map((file, index) => (
        // 涓烘瘡涓枃浠舵覆鏌撲竴涓狥ile缁勪欢
        <InputFileItem key={index} file={file} onRemove={onRemoveFile} />
      ))}
    </div>
  );
};

export default InputFileArea;
