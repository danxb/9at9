"use client";

import { useEffect, useRef } from "react";

interface ArticlesProps {
  items?: string[];
}

export const Articles: React.FC<ArticlesProps> = ({ items = [] }) => {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const masonryRef = useRef<any>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    
    const Masonry = require("masonry-layout");

    masonryRef.current = new Masonry(gridRef.current, {
        itemSelector: ".grid-item",
        percentPosition: true,
        gutter: 12,
        columnWidth: ".grid-item"   // <-- this line tells Masonry the column width
    });

    masonryRef.current.layout();
  }, []);

  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    const tile = (e.currentTarget.closest(".grid-item") as HTMLElement) || null;
    if (!tile || !masonryRef.current) return;

    tile.remove();
    masonryRef.current.remove(tile);
    masonryRef.current.layout();
  };

  // fallback content if no items provided
  const tiles = items.length ? items : [
    {
        title: "Root's Australian Century Chase",
        summary: `Joe Root, England's batting mainstay, arrives in Australia for his fourth Ashes tour still seeking his first Ashes century on Australian soil, a statistic highlighted by local media. Despite facing one of the world’s best bowling attacks and previously shouldering the captaincy under challenging circumstances, Root is in excellent form and seems unfazed by the pressure or headlines. His consistency and positive mindset suggest he is well-placed to break his century drought, but Root’s main focus remains helping England win the Ashes, valuing team success over personal milestones.`,
        source: "Sky Sports",
        url: "https://bbc.co.uk/news/whatever"
    },
    {
        title: "Paul vs Joshua Showdown",
        summary: `Jake Paul is set to face former two-time unified world heavyweight champion Anthony Joshua in an eight-round heavyweight bout on December 19 at Miami's Kaseya Center. Originally scheduled to fight Gervonta Davis, Paul now takes on a significantly tougher opponent, with the match to be streamed globally on Netflix.

Joshua seeks to rebound from a knockout loss to Daniel Dubois, while Paul enters after a victory over Julio Cesar Chavez Jr. The bout is promoted as a clash between boxing's new era and traditional power, drawing huge attention due to both fighters' celebrity status and competitive backgrounds.`,
        source: "Sky Sports",
        url: "https://skysports.com/whatever"
    },
    {
        title: "UK Overhauls Asylum",
        summary: `Home Secretary Shabana Mahmood has announced sweeping reforms to the UK's asylum and migration system, drawing inspiration from Denmark's strict approach. The measures include making refugee status temporary with 30-month reviews, requiring a 20-year residency before eligibility for permanent settlement, and narrowing the appeal process to a single consolidated claim. Support for asylum seekers will be restricted, with only the destitute qualifying for aid and those with assets required to contribute to their own accommodation. There will be new legal routes with annual caps, expanded pathways for refugees via work and community sponsorship, and tougher enforcement using AI technology and digital IDs. Countries that refuse to accept returns of their nationals will face visa penalties, and families refused asylum will lose ongoing support. The government aims to curb abuse of the current system and discourage illegal migration, while offering some legal and skills-based routes to settlement.`,
        source: "BBC",
        url: "https://skysports.com/whatever"
    },
    {
        title: "Hilton Denies Maxwell Link",
        summary: `Paris Hilton has firmly denied longstanding rumors that Ghislaine Maxwell tried to recruit her into Jeffrey Epstein's circle, saying she does not even remember meeting Maxwell. The speculation began after accounts and a resurfaced photo placed Hilton at the same 2000 event as Maxwell and Donald Trump, but Hilton insists these stories persist merely because she is a 'clickbait' name. Despite multiple reports tying her to Epstein's network, Hilton maintains she has no memory of any interaction with Maxwell and has no association with the pair.`,
        source: "Metro",
        url: "https://bbc.co.uk/news/whatever"
    },
    {
        title: "Bridget Jones Immortalised",
        summary: `A bronze statue of romcom icon Bridget Jones was unveiled in London's Leicester Square, adding her to an esteemed line-up of cinematic legends like Harry Potter and Mary Poppins. The event featured cast members, including a memorable, sweary outburst from Sally Phillips, and highlighted the statue's tribute to one of the character’s most famous features: her 'mummy pants.'

Author Helen Fielding reflected on Bridget’s enduring appeal, noting her relatability for women navigating societal pressures. With Renée Zellweger and fellow cast in attendance, the statue cements Bridget Jones's legacy as a beloved London heroine and a permanent part of the city's film history trail.`,
        source: "Metro",
        url: "https://skysports.com/whatever"
    },
    {
        title: "Brosnan on Bond",
        summary: `Pierce Brosnan, famed for his four-film stint as James Bond, has reflected on the possibility of returning to the franchise. While he emphasizes that the role of 007 now belongs to another actor—especially as director Denis Villeneuve is seeking a new, unknown British man—Brosnan hints at openness to being involved in the films in some capacity. He also reveals a fondness for playing villains, suggesting he might be interested in a future Bond antagonist role. Despite his age, Brosnan expresses continued passion for acting and embracing new character challenges.`,
        source: "Metro",
        url: "https://skysports.com/whatever"
    }
  ];

  return (
    <div className="grid" ref={gridRef}>
      <div className="grid-sizer"></div>

      {tiles.map((item, i) => (
        <div className="grid-item mb-3" key={i} style={{ width: "32%", marginBottom: "12px" }}>
          <div
            className="well"
            style={{
              position: "relative",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#fff"
            }}
          >
            <button
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                fontSize: "1.1rem"
              }}
              onClick={handleClose}
              aria-label="Close article"
            >
              &times;
            </button>
            
            <h4 style={{ margin: "0 0 6px" }}>{item.title}</h4>

            <p style={{ margin: "0 0 10px", whiteSpace: "pre-line" }} class="dropcap">
                {item.summary}
            </p>

            <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "6px" }}>
                Source: {item.source}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};
