export default function PlaygroundInfoBox() {
  return (
    <div className="mt-6 p-4 bg-gray-800/50 backdrop-blur-sm border border-red-500/30 rounded-lg shadow-lg">
      <h3 className="text-sm font-semibold text-red-300 mb-2">
        💡 How it works:
      </h3>
      <ul className="text-xs text-gray-300 space-y-1">
        <li>
          <strong className="text-red-400">No image + prompt:</strong> Generate
          a new image
        </li>
        <li>
          <strong className="text-red-400">Image only:</strong> Analyze the
          image
        </li>
        <li>
          <strong className="text-red-400">Image + option selected:</strong>{" "}
          Execute the selected action
        </li>
        <li>
          <strong className="text-red-400">Image + prompt:</strong> AI
          interprets and executes the best action
        </li>
      </ul>
    </div>
  );
}
