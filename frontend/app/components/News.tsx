export interface Article {
  id?: number;
  source: string;
  category: string;
  title: string;
  summary: string;
  url: string;
}

function formatSource(item: Article): string {
  if (item.source !== "Sky Sports") {
    return `${item.source} ${item.category}`; // only change if Sport
  }

  let specific: string = "";

  try {
    const urlPath = new URL(item.url).pathname; // "/darts/news/..."
    const parts = urlPath.split("/").filter(Boolean); // ["darts", "news", ...]
    
    if (parts.length > 0) {
      specific = parts[0]; // e.g., "darts" or "nba" or "rugby-union"
    }
  } catch {
    return item.category;
  }

  // Replace dashes with spaces
  specific = specific.replace(/-/g, " ");

  // Capitalize properly, handle exceptions
  const exceptions: Record<string, string> = {
    nba: "NBA",
    nfl: "NFL",
    nhl: "NHL",
    mlb: "MLB",
    "rugby union": "Rugby Union",
  };

  const lower = specific.toLowerCase();
  specific = exceptions[lower] ?? specific.charAt(0).toUpperCase() + specific.slice(1);

  return `${item.source}  (${specific})`;
}

export const News = {
  getTiles: async (): Promise<(Article & { type: "news" })[]> => {
    const res = await fetch("/api/articles");
    const data = await res.json();
    return Array.isArray(data) ? data.map(d => ({ ...d, type: "news" })) : [];
  },

  // Only the **content** of the tile, no .grid-item wrapper
  TileContent: ({ data }: { data: Article }) => (
    <>
      <h4 style={{ margin: "0 0 6px" }}>{data.title}</h4>

      <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
        {data.summary}
      </p>

      <div
        className="source"
        style={{ color: "#666", marginBottom: "6px", marginTop: "20px" }}
      >
          <div className="row align-items-end">
              <div className="col-6">
                  {formatSource(data)}
              </div>
              <div className="col-6 text-end">
                  <a href={data.url} target="_blank" rel="noopener noreferrer">Read source article ↗</a>
              </div>
          </div>
      </div>
    </>
  ),
};

export default News;