import React, { useEffect, useState } from "react";
import Head from "next/head";
import TopNavBar from "../components/TopNavBar";
import LeftMenu from "../components/LeftMenu";
import { ipcRenderer } from "electron";
import HomeCarrousel from "../components/HomeCarrousel";
import HomeSwiper from "../components/HomeSlider";

function Home() {
  const [movies, setMovies] = useState([]);
  const posterBaseUrl = "http://localhost:3000/posters";
  const swiperGenres = [
    "Action",
    "Adventure",
    "Comedy",
    "Crime",
    "Drama",
    "Horror",
  ];

  useEffect(() => {
    ipcRenderer.invoke("get-metadata").then(setMovies);
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Home</title>
      </Head>
      <TopNavBar />
      <div
        className="flex overflow-auto"
        style={{ height: "calc(100vh - 56px )", padding: 0 }}
      >
        <LeftMenu movies={movies} />
        <div className="flex-auto bg-primary2 p-4">
          <div className="overflow-auto h-full custom-scrollbar">
            <div className="flex flex-col justify-between ">
              <HomeCarrousel movies={movies} posterBaseUrl={posterBaseUrl} />
              {swiperGenres.map((genre) => {
                const moviesByGenre = movies
                  ? movies.filter((movie) => movie.genres.includes(genre))
                  : [];

                return (
                  <React.Fragment key={genre}>
                    <h2 className="font-bold text-2xl pb-2 ml-12">{genre}</h2>
                    <HomeSwiper
                      movies={moviesByGenre}
                      posterBaseUrl={posterBaseUrl}
                    />
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Home;
