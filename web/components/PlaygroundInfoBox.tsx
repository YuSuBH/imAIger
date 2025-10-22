export default function PlaygroundInfoBox() {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">
        💡 How it works:
      </h3>
      <ul className="text-xs text-blue-800 space-y-1">
        <li>
          <strong>No image + prompt:</strong> Generate a new image
        </li>
        <li>
          <strong>Image only:</strong> Analyze the image
        </li>
        <li>
          <strong>Image + option selected:</strong> Execute the selected action
        </li>
        <li>
          <strong>Image + prompt:</strong> AI interprets and executes the best
          action
        </li>
      </ul>
    </div>
  );
}
