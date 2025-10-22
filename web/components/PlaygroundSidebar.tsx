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
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-indigo-600">AI Playground</h2>
        <p className="text-xs text-gray-500 mt-1">All-in-one image tools</p>
      </div>

      {/* Configuration Panel */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Upscale Settings
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Upscale Factor
            </label>
            <select
              value={upscaleFactor}
              onChange={(e) => onUpscaleFactorChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="2">2x (Double)</option>
              <option value="4">4x (Quadruple)</option>
              <option value="6">6x (Six times)</option>
              <option value="8">8x (Eight times)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Output Format
            </label>
            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="JPG">JPG</option>
              <option value="PNG">PNG</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Placeholder */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 mb-2">History</h3>
        <p className="text-xs text-gray-400">Coming soon...</p>
      </div>
    </aside>
  );
}
