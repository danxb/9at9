"use client";

import React, { useEffect, useState } from "react";
import { getTagline, formatLastUpdated } from "../helpers/lastUpdatedHelpers";

interface DailyLoadStatus {
  in_progress: 0 | 1;
  last_updated: string;
}

export const LastUpdated: React.FC = () => {
  // Tracks if the database is currently updating
  const [isDbUpdating, setIsDbUpdating] = useState(false);
  // Stores the last successful update timestampx
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [tagline, setTagline] = useState("");

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/daily-load-status");
      if (!res.ok) throw new Error("Failed to fetch daily load status");
      const data: DailyLoadStatus = await res.json();

      // Always update the last updated timestamp
      setLastUpdated(data.last_updated);
      // Update only if the database is in progress
      setIsDbUpdating(data.in_progress === 1);
    } catch (err) {
      console.error(err);
    }
  };

  // Initial fetch + polling every 15s
  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 15000);
    return () => clearInterval(intervalId);
  }, []);

  // Update tagline whenever the DB update status or lastUpdated changes
  useEffect(() => {
    const newTagline = getTagline(isDbUpdating, lastUpdated, tagline);
    setTagline(newTagline);
  }, [isDbUpdating, lastUpdated]);

  return (
    <div className="last-updated">
      <span className="updating">{isDbUpdating
        ? "Updating..."
        : lastUpdated && formatLastUpdated(new Date(lastUpdated))}
      </span>
      <small className="text-secondary">
        <p className="text-sm text-gray-500 italic">
          {tagline}
        </p>
      </small>
    </div>
  );
};
