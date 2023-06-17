import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
SwiperCore.use([Autoplay, Pagination, Navigation]);
import Link from "next/link";
import "swiper/css";

const HomeCarrousel = ({ movies, posterBaseUrl }) => {
  if (!movies) {
    return <div>Loading...</div>;
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 4500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay]}
      className="mySwiper"
      style={{
        width: "calc(100vw - 400px )",
        height: "fit-content",
        marginTop: "10px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      {movies.map((movie) => (
        <SwiperSlide key={movie.id}>
          <div style={{ position: "relative" }}>
            <img
              style={{
                width: "fit-content",
                height: "fit-content",
              }}
              src={`${posterBaseUrl}/${movie.id}_bd.jpg`}
              alt={movie.title}
            />
            <div
              style={{
                position: "absolute",
                bottom: 20,
                left: 20,
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                width: "580px",
                maxHeight: "700px",
                padding: "15px",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.2em",
                  fontWeight: "bold",
                }}
                className="flex gap-5 my-auto justify-left items-center"
              >
                {movie.title}
                <p className="font-light text-base my-auto">
                  {movie.duration} Minutes
                </p>
              </h2>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "0.9em",
                  lineHeight: "1.3em",
                  overflow: "auto",
                  textOverflow: "ellipsis",
                  maxHeight: "200px",
                  fontWeight: "lighter",
                }}
                className="font-sans text-justify custom-scrollbar"
              >
                {movie.overview}
              </p>
              <div className="flex gap-4 mt-5 mb-1 justify-center">
                <Link href={`/movies/${movie.id}`}>
                  <a className="inline-block px-6 py-2 text-xs font-medium text-center text-primary2 bg-secondary uppercase transition rounded shadow ripple hover:shadow-lg hover:bg-primary focus:outline-none mb-2">
                    Play Now
                  </a>
                </Link>
                <Link href={`/movies/${movie.id}`}>
                  <a className="inline-block px-6 py-2 text-xs font-medium text-center text-white bg-primary uppercase transition rounded shadow ripple hover:shadow-lg hover:bg-primary focus:outline-none mb-2">
                    Add to list
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeCarrousel;
