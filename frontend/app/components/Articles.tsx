"use client";

import React, { useState, useEffect, useRef } from "react";

interface Article {
  id?: number;
  source: string;
  category: string;
  title: string;
  summary: string;
  url: string;
}

export const Articles: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const masonryRef = useRef<any>(null);

  const [tiles, setTiles] = useState<Article[]>([]);

  // Fetch articles from the API
  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then((data) => {
        setTiles(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error(err));
  }, []);

  // Initialize Masonry on first render
  useEffect(() => {
    if (!gridRef.current) return;

    const Masonry = require("masonry-layout");

    masonryRef.current = new Masonry(gridRef.current, {
      itemSelector: ".grid-item",
      percentPosition: true,
      gutter: 0,
      columnWidth: ".grid-item",
    });
  }, []);

  // Re-layout Masonry whenever tiles change
  useEffect(() => {
    if (masonryRef.current) {
      masonryRef.current.reloadItems(); // tell Masonry there are new items
      masonryRef.current.layout();      // recalc positions and container height
    }
  }, [tiles]);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tile = (e.currentTarget.closest(".grid-item") as HTMLElement) || null;
    if (!tile || !masonryRef.current) return;

    tile.remove();
    masonryRef.current.remove(tile);
    masonryRef.current.layout();
  };

  return (
    <div ref={gridRef} className="row">
      {tiles.map((item, i) => (
        <div className="col-12 col-sm-6 col-md-4 mb-4 grid-item" key={i}>
          <div
            className="well"
            style={{
              position: "relative",
              padding: "20px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#fff",
            }}
          >
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-2"
              onClick={handleClose}
              aria-label="Close article"
            />

            <h4 style={{ margin: "0 0 6px" }}>{item.title}</h4>

            <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
              {item.summary}
            </p>

            <div
              style={{ fontSize: "0.85rem", color: "#666", marginBottom: "6px", marginTop: "20px" }}
            >
              Source: {item.source}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
