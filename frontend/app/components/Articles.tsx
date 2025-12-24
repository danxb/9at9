"use client";

import React, { useState, useEffect, useRef } from "react";
import News, { Article as NewsArticle } from "./News";
import Weather, { Forecast as WeatherTile } from "./Weather";

type TileType = 
  | (NewsArticle & { type: "news" }) 
  | (WeatherTile & { type: "weather" }); // | TVTile

export const Articles: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const masonryRef = useRef<any>(null);
  const [tiles, setTiles] = useState<TileType[]>([]);

  // Fetch all tiles
  useEffect(() => {
    async function fetchTiles() {
      const newsTiles = await News.getTiles();
      const weatherTiles = await Weather.getTiles();
      // const tvTiles = await TV.getTiles();

      setTiles([...newsTiles, ...weatherTiles] as TileType[]); // add tvTiles later
    }
    fetchTiles();
  }, []);

  // Initialize Masonry once
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

  // Re-layout whenever tiles change (after React has painted)
  useEffect(() => {
    if (masonryRef.current) {
      requestAnimationFrame(() => {
        masonryRef.current.reloadItems();
        masonryRef.current.layout();
      });
    }
  }, [tiles]);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tile = (e.currentTarget.closest(".grid-item") as HTMLElement) || null;
    if (!tile || !masonryRef.current) return;

    tile.remove();
    masonryRef.current.remove(tile);
    masonryRef.current.layout();
  };

  // Render content inside .grid-item using the appropriate TileContent function
  const renderTileContent = (tile: TileType) => {
    switch (tile.type) {
      case "news":
        return <News.TileContent data={tile as NewsArticle} />;
      case "weather":
        return <Weather.TileContent data={tile as WeatherTile} />;
      default:
        return null;
    }
  };

  return (
    <div ref={gridRef} className="row">
      {tiles.length === 0
        ? Array.from({ length: 6 }).map((_, i) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4 grid-item" key={i}>
              <div className="well" style={{ minHeight: "180px" }} />
            </div>
          ))
        : tiles.map((tile, i) => (
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
                {renderTileContent(tile)}
              </div>
            </div>
          ))}
    </div>
  );
};
