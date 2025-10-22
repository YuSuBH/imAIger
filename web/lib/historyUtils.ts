// Simple localStorage-based history for demo purposes

export interface HistoryItem {
  id: string;
  type: "generate" | "analyze" | "upscale" | "bgRemove";
  timestamp: number;
  input: {
    prompt?: string;
    query?: string;
    imageName?: string;
    factor?: string;
  };
  output: {
    imageUrl?: string;
    text?: string;
  };
}

const HISTORY_KEY = "ai-site-history";
const MAX_HISTORY_ITEMS = 50;

export function saveToHistory(item: Omit<HistoryItem, "id" | "timestamp">) {
  try {
    const history = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // Add to beginning and limit size
    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load history:", error);
    return [];
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}

export function deleteHistoryItem(id: string) {
  try {
    const history = getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to delete history item:", error);
  }
}
