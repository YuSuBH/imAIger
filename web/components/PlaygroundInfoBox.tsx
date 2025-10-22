export default function PlaygroundInfoBox() {
  return (
    <div className="mt-6 p-6 bg-black border border-red-500/30 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center">
        <span className="text-2xl mr-2">💡</span>
        Follow these guidelines for the best experience
      </h3>
      <ul className="text-base text-gray-200 space-y-3 leading-relaxed">
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">Be detailed:</strong> Provide more
            specific descriptions to generate or analyze better results
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">File size matters:</strong> Larger
            image files will take longer to process
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">Background removal:</strong> Works
            best when there&apos;s clear separation between subject and
            background
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">Upscaling tip:</strong> Produces
            the best results on lower resolution or compressed photos
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">Format selection:</strong> Use PNG
            for images with transparency, JPG for smaller file sizes
          </span>
        </li>
        <li className="flex items-start">
          <span className="text-red-400 mr-3 mt-1">•</span>
          <span>
            <strong className="text-red-400">AI interpretation:</strong> Let AI
            decide the best action by describing what you want in natural
            language
          </span>
        </li>
      </ul>
    </div>
  );
}
