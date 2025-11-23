"use client";

import React, { useEffect, useState, useRef } from "react";
import { getTagline, formatLastUpdated } from "../helpers/lastUpdatedHelpers";

interface DailyLoadStatus {
  in_progress: 0 | 1;
  last_updated: string;
}

export const LastUpdated: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/daily-load-status");
      if (!res.ok) throw new Error("Failed to fetch daily load status");
      const data: DailyLoadStatus = await res.json();

      setLoading(data.in_progress === 1);
      if (data.in_progress === 0) setLastUpdated(data.last_updated);
    } catch (err) {
      console.error(err);
    }
  };

  // Track previous loading state
  const prevLoadingRef = useRef(loading);

  const [tagline, setTagline] = useState("Time is a social construct.");

  useEffect(() => {
    fetchStatus();
    const intervalId = setInterval(fetchStatus, 15000); // poll every 15s
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
  const newTagline = getTagline(loading, lastUpdated, tagline); // pass current tagline
  setTagline(newTagline);
}, [loading, lastUpdated]);

  return (
    <div className="last-updated">
      {loading ? "Updating..." : lastUpdated && formatLastUpdated(new Date(lastUpdated))}
      <br />
      <small className="text-secondary">
        <p className="text-sm text-gray-500 italic">{tagline}</p>
      </small>
    </div>
  );
};
