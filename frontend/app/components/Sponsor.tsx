import React from "react";

export interface Summary {
  message: string;
}

const headings = ["Support"]; // optional

export const Sponsor = {
  getTiles: async (): Promise<(Summary & { type: "sponsor" })[]> => {
    return [
      {
        message: "Support",
        type: "sponsor",
      },
    ];
  },

  TileContent: ({ data }: { data: Summary }) => {
    const message = data.message;

    return (
      <>
        <p id="why">
          Built by one person, with costs for domain, hosting, and AI. Any contributions help keep <a href="/about">the site</a> running. Thank you.
        </p>
        <p id="how">
          <a href="https://buymeacoffee.com/9x9.news" target="_blank" rel="noopener noreferrer">
            https://buymeacoffee.com/9x9.news ↗
          </a>
        </p>
      </>
    );
  },
};

export default Sponsor;
