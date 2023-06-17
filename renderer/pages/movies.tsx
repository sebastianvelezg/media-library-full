import React, { useEffect, useState } from "react";
import Head from "next/head";
import TopNavBar from "../components/TopNavBar";
import LeftMenu from "../components/LeftMenu";
import { ipcRenderer } from "electron";

import { useRouter } from "next/router";
import MainMoviesSection from "../components/MainMoviesSection";
import RightMenu from "../components/RightMenu";

function Movies() {
  const router = useRouter();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [cardWidth, setCardWidth] = useState(200);
  const [filter, setFilter] = useState({
    type: "",
    value: "",
  });

  useEffect(() => {
    const filterType = (localStorage.getItem("filterType") || "") as string;
    const filterValue = (localStorage.getItem("filterValue") || "") as string;
    setFilter({ type: filterType, value: filterValue });
  }, []);

  useEffect(() => {
    ipcRenderer.invoke("get-metadata").then(setMovies);
  }, []);

  useEffect(() => {
    setFilteredMovies(movies);
  }, [movies]);

  useEffect(() => {
    let filtered = [...movies];
    if (filter.type) {
      switch (filter.type) {
        case "genre":
          filtered = movies.filter((movie) =>
            movie.genres.includes(filter.value)
          );
          break;
        case "date":
          filtered.sort(
            (a, b) =>
              new Date(b.release_date as any).getTime() -
              new Date(a.release_date as any).getTime()
          );

          break;
        case "name":
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "popularity":
          filtered.sort(
            (a, b) => parseFloat(b.popularity) - parseFloat(a.popularity)
          );
          break;
        default:
          break;
      }
    }
    setFilteredMovies(filtered);
  }, [filter, movies]);

  const handleSliderChange = (e) => {
    setCardWidth(e.target.value);
  };

  const updateFilter = (type, value) => {
    localStorage.setItem("filterType", type);
    localStorage.setItem("filterValue", value);
    setFilter({ type, value });
  };

  const filterByGenre = (genre) => {
    updateFilter("genre", genre);
  };

  const filterByDate = () => {
    updateFilter("date", "");
  };

  const filterByName = () => {
    updateFilter("name", "");
  };

  const filterByPopularity = () => {
    updateFilter("popularity", "");
  };

  return (
    <React.Fragment>
      <Head>
        <title>Movies</title>
      </Head>
      <TopNavBar />

      <div
        className="flex overflow-hidden"
        style={{ height: "calc(100vh - 56px)" }}
      >
        <LeftMenu movies={movies} />

        <MainMoviesSection
          cardWidth={cardWidth}
          filteredMovies={filteredMovies}
        />

        <RightMenu
          handleSliderChange={handleSliderChange}
          filterByDate={filterByDate}
          filterByName={filterByName}
          filterByPopularity={filterByPopularity}
          filterByGenre={filterByGenre}
        />
      </div>
    </React.Fragment>
  );
}

export default Movies;
