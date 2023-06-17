import React from "react";
import MediaCard from "./MediaCard";

function MainMoviesSection({ cardWidth, filteredMovies }) {
  return (
    <div className="flex-auto bg-primary2 p-4">
      <div className="overflow-auto h-full custom-scrollbar">
        <div className="flex flex-wrap justify-center mb-20 gap-5">
          {filteredMovies.map((movie, index) => (
            <div
              className="gap-10"
              style={{ width: `${cardWidth}px` }}
              key={index}
            >
              <MediaCard
                key={index}
                width={cardWidth}
                id={movie.id}
                title={movie.title}
                overview={movie.overview}
                poster={`http://localhost:3000/posters/${movie.id}.jpg`}
                backdrop={`http://localhost:3000/posters/${movie.id}_bd.jpg`}
                popularity={movie.popularity}
                release_date={movie.release_date}
                duration={movie.duration}
                path={movie.path}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainMoviesSection;
