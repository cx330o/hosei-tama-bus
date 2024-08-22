interface ImageModalProps {
  isOpen: boolean
  imageUrl: string
  alt: string
  onClick: () => void
}

const ImageModal = ({ isOpen, imageUrl, alt, onClick }: ImageModalProps) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
      />
    </div>
  )
}

export default ImageModal
