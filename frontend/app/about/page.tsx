"use client";

import Logo from '../components/Logo';
import { LastUpdated } from '../components/LastUpdated';

import React, { useState, useEffect, useRef, ReactNode } from "react";

type Tile = {
  id: number;
  content: ReactNode; 
};

const tiles = [
  {
    id: 1,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>Nine stories at Nine o'clock</h4>
        <p style={{ margin: "0 0 10px" }}>
          Nine stories made up of:
        </p>
        <ul>
          <li>3 main stories from BBC News</li>
          <li>3 main stories for Sky Sports</li> 
          <li>3 main stories for Metro Entertainment</li> 
        </ul>
        <p style={{ margin: "0 0 10px" }}>
          Plus:
        </p>
        <ul>
          <li>9 cities temperatures</li>
          <li>9pm films</li> 
          <li>9x9 grid sudoku (coming soon)</li> 
        </ul>
      </>
    )
  },
  {
    id: 2,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>News Without the Noise</h4>
        <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
          It can be difficult to read news on other websites, 
          difficult to follow where the next line of the article is, due to all the 
          images and adverts, plus popups about cookies or video ads disrupting you.
        </p>
        <p style={{ margin: "0 0 10px" }}>
          9x9.news has no ads, no images, no videos, no pop-ups and nothing to agree to.
        </p>
      </>
    )
  },
  {
    id: 3,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>Text-only and Safe for work</h4>
        <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
          Even on your lunch-break, when reading mainstream news sites at work it can feel 
          like it is obvious to others you are not working.
        </p>
        <p style={{ margin: "0 0 10px" }}> 
          Being text-only, 9x9.news is a good choice to read at work, just text and no 
          eye-catching pictures and videos for prying eyes.
        </p>
      </>
    )
  },
  {
    id: 4,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>The day in one scroll</h4>
        <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
          Nine stories covering news, sports and entertainment brings you up to date. 
          The stories are summarised (you can click through to the main article if you want) 
          so you can be quickly brought up-to-date with what is going on today. There are 
          also temperatues of 9 European Cities and a summary of films on at 9pm tonight, 
          so you can plan your evening. We only bother you with films rated 6 and over.
        </p>
      </>
    )
  },
  {
    id: 5,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>Data Friendly</h4>
        <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} className="dropcap">
          If you are low on data or have a slow internet connection, 9x9.new is ideal. 
          Text uses hardly any data compared to images and videos.
        </p>
      </>
    )
  },
  {
    id: 6,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>Traditional</h4>
        <ul>
          <li>Posted in the morning</li>
          <li>No live updates</li>
          <li>Newspaper layout</li>
          <li>Dropped capitals</li>
          <li>Serif text with Sans-serif headings</li>
          <li>Weather</li>
          <li>Terrestial TV listings</li>
          <li>(Games coming soon)</li>
        </ul>
      </>
    )
  },
  {
    id: 7,
    content: (
      <>
        <h4 style={{ margin: "0 0 6px" }}>Modern</h4>
        <ul>
          <li>Internet news aggregation</li>
          <li>Open AI news summaries</li>
          <li>Responsive design</li>
          <li>The name 9x9.news signals a contemporary brand</li>
          <li>You can close the article once read (they will all re-appear on a refresh)</li>
        </ul>
      </>
    )
  }
];

export default function Page() {

  const gridRef = useRef<HTMLDivElement | null>(null);
  const masonryRef = useRef<any>(null);

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

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-light bg-light text-dark mt-1 mb-3">
        <div className="container d-flex flex-column flex-md-row align-items-start">
          <div>
            <Logo />
          </div>
          <div className="ms-md-auto mt-2 mt-md-0">
            <LastUpdated />
          </div>
        </div>
      </nav>


      {/* Main Content */}
      <main className="main-container container mt-1 about">
        <div ref={gridRef} className="row">
          <div className="col-12 col-sm-6 col-md-4 mb-4 grid-item" key="0">
            <div className="card text-white bg-dark about-card" style={{ position: "relative", padding: "5px"}}>
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-2"
                  onClick={handleClose}
                  aria-label="Close article"
                />
              <div className="card-body">
                <h4 className="text-white" style={{ margin: "0 0 6px" }}>About 9x9.news</h4>
                <p className="text-white">9x9.news is a free, text-only news site that delivers the day's key stories in short, distraction-free summaries.</p>
              </div>
            </div>
          </div>
          { tiles.map((tile) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4 grid-item" key={tile.id}>
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
                {tile.content}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
