import { ReactNode } from "react";

interface ImageCardProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  minHeight?: string;
}

export default function ImageCard({
  title,
  action,
  children,
  minHeight = "400px",
}: ImageCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        {action}
      </div>
      <div
        className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex items-center justify-center bg-gray-50"
        style={{ minHeight }}
      >
        {children}
      </div>
    </div>
  );
}
