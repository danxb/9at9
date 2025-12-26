export interface TvGuide {
  id?: number;
  films: { channel: string; title: string; year: number; imdbRating: number; desc: string; }[]; // store array directly
}

export const Films = {
  getTiles: async (): Promise<(TvGuide & { type: "films" })[]> => {
    const res = await fetch("/api/films");
    const data: { films: { channel: string; title: string; year: number; imdbRating: number; desc: string; }[] } = await res.json();

    return [
      {
        films: data.films,
        type: "films",
      },
    ];
  },

  TileContent: ({ data }: { data: TvGuide }) => {
    const films = [...(data.films || [])].sort(
      (a, b) => b.imdbRating - a.imdbRating
    );

    return (
      <>
        <h4>Films at 9pm Tonight</h4>
        <div className="films">
          {films.map((item, index) => (
            <div key={index}>
              <h5>{item.title}</h5>
              <p>{item.desc} </p>
              <div className="footer row align-items-end mb-4">
                  <div className="col-8">
                      {item.channel}
                  </div>
                  <div className="col-4 text-end">
                      Rating: {item.imdbRating}
                  </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  },
};

export default Films;
