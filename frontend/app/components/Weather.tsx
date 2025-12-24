import React, { useEffect, useState } from "react";

export interface Forecast {
  id?: number;
  cities: { city: string; temp: number }[]; // store array directly
}

const headings = [
  "Degrees of Separation Are We Warm Yet?",
  "Europe at a Glance",
  "The Morning Weather Table",
  "Temperature Readings - Europe",
  "Europe Temps",
  "9 Capitals x 9am",
  "Today's Temperatures Across Europe"
];

export const Weather = {
  getTiles: async (): Promise<(Forecast & { type: "weather" })[]> => {
    const res = await fetch("/api/forecast");
    const data: { cities: { city: string; temp: number }[] } = await res.json();

    return [
      {
        cities: data.cities,
        type: "weather",
      },
    ];
  },

  TileContent: ({ data }: { data: Forecast }) => {
    const cities = [...(data.cities || [])].sort(
      (a, b) => b.temp - a.temp
    );

    const [heading, setHeading] = useState<string | null>(null);
      
    useEffect(() => {
      const random =
        headings[Math.floor(Math.random() * headings.length)];
      setHeading(random);
    }, []);

    return (
      <>
        <h4>{ heading }</h4>
        <ul className="list-unstyled row">
          {cities.map((item, index) => (
            <li key={index} className="col-6">
              {item.city}: {item.temp}°C
            </li>
          ))}
        </ul>
      </>
    );
  },
};

export default Weather;
