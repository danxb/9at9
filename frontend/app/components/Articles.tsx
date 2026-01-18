"use client";

import React, { useState, useEffect, useRef } from "react";
import News, { Article as NewsArticle } from "./News";
import Weather, { Forecast as WeatherTile } from "./Weather";
import Films, { TvGuide as FilmTile } from "./Films";
import Sponsor, { Summary as SponsorTile } from "./Sponsor";

type TileType = 
  | (NewsArticle & { type: "news" }) 
  | (WeatherTile & { type: "weather" })
  | (FilmTile & { type: "films" })
  | (SponsorTile & { type: "sponsor" })
; 

export const Articles: React.FC = () => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const masonryRef = useRef<any>(null);
  const [tiles, setTiles] = useState<TileType[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tiles
  useEffect(() => {
    async function fetchTiles() {
      const newsTiles = await News.getTiles();
      const weatherTiles = await Weather.getTiles();
      const filmTiles = await Films.getTiles();
      const sponsorTiles = await Sponsor.getTiles();

      setTiles([...newsTiles, ...weatherTiles, ...filmTiles, ...sponsorTiles] as TileType[]); 
      setLoading(false);
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

  const handleClose = (index: number) => {
    setTiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Render content inside .grid-item using the appropriate TileContent function
  const renderTileContent = (tile: TileType) => {
    switch (tile.type) {
      case "news":
        return <News.TileContent data={tile as NewsArticle} />;
      case "weather":
        return <Weather.TileContent data={tile as WeatherTile} />;
      case "films":
        return <Films.TileContent data={tile as FilmTile} />;
      case "sponsor":
        return <Sponsor.TileContent data={tile as SponsorTile} />;
      default:
        return null;
    }
  };

  let rowStyle: React.CSSProperties = {};

  if (loading || tiles.length === 0) {
    rowStyle.minHeight = "200px";
  }

  return (
    <div ref={gridRef} className="row" style={rowStyle}>
      {loading ? (
          // show placeholders while fetching
          Array.from({ length: 6 }).map((_, i) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4 grid-item" key={i}>
              <div className="well" style={{ minHeight: "180px" }} />
            </div>
          ))
        ) : tiles.length === 0 ? (
          // show message if user closed all tiles
          <div className="col-12 text-center py-5">
            <p>
              What's black and white and read all over? <strong>9x9.news</strong>.<br /> 
              Check back tomorrow at 9am for more.
            </p>
          </div>
        ) : tiles.map((tile, i) => (
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
                  onClick={() => handleClose(i)}
                  aria-label="Close article"
                />
                {renderTileContent(tile)}
              </div>
            </div>
          ))}
    </div>
  );
};
