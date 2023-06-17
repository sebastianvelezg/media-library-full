import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import path from "path";
import TopNavBar from "../../components/TopNavBar";
import RatingPieChart from "../../components/RatingPieChart";

interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  popularity: number;
  release_date: string;
  duration: number;
  path: string;
}

const MoviePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState<MovieData | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const { ipcRenderer } = window.require("electron");
      const movie: MovieData = await ipcRenderer.invoke("fetch-data-by-id", id);
      setMovie(movie);
    };

    fetchMovie();
  }, [id]);

  if (!movie) {
    return (
      <div>
        <Link href="/home">
          <a className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-primary2 rounded shadow ripple hover:shadow-lg hover:bg-secondary focus:outline-none mb-2">
            Home
          </a>
        </Link>
        <p>Loading...</p>
        <p>{id}</p>
      </div>
    );
  }

  const {
    title,
    overview,
    poster,
    backdrop,
    popularity,
    release_date,
    duration,
    path,
  } = movie;

  return (
    <React.Fragment>
      <Head>
        <title>{title} - Movie Page</title>
      </Head>

      <div className="flex flex-col h-screen w-screen">
        <TopNavBar />

        <div className="flex flex-col bg-black shadow-lg  overflow-hidden w-full  h-full relative">
          <div
            className="movie-bg w-4/5 h-full"
            style={{
              backgroundImage: `url(http://localhost:3000/posters/${movie.id}_bd.jpg)`,
              backgroundSize: "cover",
            }}
          ></div>
          <div className="content absolute inset-y-0 right-0 flex flex-col justify-between text-right  w-1/5 mb-4 mr-2">
            <div className="flex justify-between  p-4">
              <div className="flex flex-col space-y-2">
                <h3 className="font-bold text-4xl mb-2 text-white text-center">
                  {title}
                </h3>
                <p className="text-gray-300 h-[395px] overflow-auto custom-scrollbar text-lg text-justify">
                  {overview}
                </p>
                <div className="flex justify-end">
                  <RatingPieChart popularity={popularity} />
                </div>

                <p className="text-gray-400">
                  Release Date:
                  <span className="text-white"> {release_date}</span>
                </p>

                <p className="text-gray-400">
                  Duration:
                  <span className="text-white"> {duration} minutes</span>
                </p>
              </div>
            </div>
            <div className="mt-auto flex flex-col">
              <Link href={`/player/${id}`}>
                <button className="mx-4 my-2 inline-block px-8 py-3 text-lg font-semibold text-white uppercase transition bg-secondary rounded shadow ripple hover:shadow-lg hover:bg-primary focus:outline-none">
                  Play Now
                </button>
              </Link>
              <Link href={`/player/${id}`}>
                <button className="mx-4 my-2 inline-block px-8 py-3 text-lg font-semibold text-white uppercase transition bg-secondary rounded shadow ripple hover:shadow-lg hover:bg-primary focus:outline-none">
                  Add to list
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default MoviePage;
