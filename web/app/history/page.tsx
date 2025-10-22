"use client";

import { useState, useEffect } from "react";
import {
  getHistory,
  clearHistory,
  deleteHistoryItem,
  HistoryItem,
} from "@/lib/historyUtils";
import Navbar from "@/components/Navbar";
import ImagePreview from "@/components/ImagePreview";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
  };

  const filteredHistory =
    filter === "all" ? history : history.filter((item) => item.type === filter);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "generate":
        return "Generate";
      case "analyze":
        return "Analyze";
      case "upscale":
        return "Upscale";
      case "bgRemove":
        return "Background Remove";
      default:
        return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "generate":
        return "bg-blue-100 text-blue-800";
      case "analyze":
        return "bg-green-100 text-green-800";
      case "upscale":
        return "bg-purple-100 text-purple-800";
      case "bgRemove":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-dvh bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold">History</h1>
                <p className="text-sm text-gray-600 mt-1">
                  View your recent operations ({filteredHistory.length} items)
                </p>
              </div>

              <div className="flex gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="generate">Generate</option>
                  <option value="analyze">Analyze</option>
                  <option value="upscale">Upscale</option>
                  <option value="bgRemove">BG Remove</option>
                </select>

                {history.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="px-4 py-2 text-sm border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>

          {filteredHistory.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-12 text-center">
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No history yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start using the AI tools to see your history here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <div key={item.id} className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(
                          item.type
                        )}`}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Input
                      </h3>
                      <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
                        {item.input.prompt && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Prompt:
                            </span>
                            <p className="text-gray-800 mt-1">
                              {item.input.prompt}
                            </p>
                          </div>
                        )}
                        {item.input.query && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Query:
                            </span>
                            <p className="text-gray-800 mt-1">
                              {item.input.query}
                            </p>
                          </div>
                        )}
                        {item.input.imageName && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Image:
                            </span>
                            <p className="text-gray-800 mt-1">
                              {item.input.imageName}
                            </p>
                          </div>
                        )}
                        {item.input.factor && (
                          <div>
                            <span className="font-medium text-gray-600">
                              Upscale Factor:
                            </span>
                            <p className="text-gray-800 mt-1">
                              {item.input.factor}x
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Output Section */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Output
                      </h3>
                      {item.output.imageUrl && (
                        <div className="border rounded overflow-hidden bg-gray-100">
                          <ImagePreview
                            src={item.output.imageUrl}
                            alt={`${item.type} output`}
                            emptyMessage="Image no longer available"
                          />
                        </div>
                      )}
                      {item.output.text && (
                        <div className="bg-gray-50 rounded p-4 text-sm text-gray-800 max-h-48 overflow-y-auto">
                          <pre className="whitespace-pre-wrap font-sans">
                            {item.output.text}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
