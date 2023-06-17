import React from "react";
import LatestMoviesCard from "./LatestMoviesCard";

function LeftMenu({ movies }) {
  return (
    <div className="flex-none w-52 bg-primary p-4 flex flex-col items-center">
      <div className="text-center">
        <h2 className="font-bold text-xl mb-4 mt-5">Latest Movies</h2>
        <div className="flex flex-wrap overflow-auto h-[560px] custom-scrollbar gap-2 px-4 py-4">
          {(movies || [])
            .filter((movie) => movie.release_date)
            .sort((a, b) => {
              if (
                typeof a.release_date === "string" &&
                typeof b.release_date === "string"
              ) {
                return (
                  new Date(b.release_date).getTime() -
                  new Date(a.release_date).getTime()
                );
              }
              return 0;
            })
            .slice(0, 10)
            .map((movie, index) => (
              <div className="w-11/12" key={index}>
                <LatestMoviesCard
                  key={index}
                  id={movie.id}
                  poster={`http://localhost:3000/posters/${movie.id}.jpg`}
                  path={movie.path}
                  title={movie.title}
                  popularity={movie.popularity}
                  release_date={movie.release_date}
                  duration={movie.duration}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default LeftMenu;
