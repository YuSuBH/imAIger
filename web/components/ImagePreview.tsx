import Image from "next/image";

interface ImagePreviewProps {
  src: string | null;
  alt: string;
  emptyMessage?: string;
  className?: string;
}

export default function ImagePreview({
  src,
  alt,
  emptyMessage = "No image",
  className = "",
}: ImagePreviewProps) {
  if (!src) {
    return (
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Image
        src={src}
        alt={alt}
        width={500}
        height={400}
        className={`w-full h-auto object-contain rounded max-h-[400px] ${className}`}
      />
    </div>
  );
}
