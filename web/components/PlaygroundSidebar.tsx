import Link from "next/link";

interface PlaygroundSidebarProps {
  upscaleFactor: string;
  format: string;
  onUpscaleFactorChange: (factor: string) => void;
  onFormatChange: (format: string) => void;
}

export default function PlaygroundSidebar({
  upscaleFactor,
  format,
  onUpscaleFactorChange,
  onFormatChange,
}: PlaygroundSidebarProps) {
  return (
    <aside className="w-64 bg-black border-r border-gray-900 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <Link
        href="/"
        className="p-2 border-b border-gray-900 block hover:bg-gray-900 transition-colors"
      >
        <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          AI Playground
        </h2>
      </Link>

      {/* Configuration Panel */}
      <div className="p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-200 mb-3">
          Upscale Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Upscale Factor
            </label>
            <select
              value={upscaleFactor}
              onChange={(e) => onUpscaleFactorChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm bg-gray-900 border border-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              <option value="2">2x (Double)</option>
              <option value="4">4x (Quadruple)</option>
              <option value="6">6x (Six times)</option>
              <option value="8">8x (Eight times)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">
              Output Format
            </label>
            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm bg-gray-900 border border-gray-800 text-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-gray-700"
            >
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Placeholder */}
      <div className="p-4 border-t border-gray-900">
        <Link
          href={"/history"}
          className="text-md font-semibold text-gray-400 mb-2"
        >
          History
        </Link>
      </div>
    </aside>
  );
}
