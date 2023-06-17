import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
import Link from "next/link";

const HomeSwiper = ({ movies, posterBaseUrl }) => {
  return (
    <Swiper
      slidesPerView={7}
      spaceBetween={30}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
      style={{
        width: "83vw",
        height: "100%",
        marginTop: "5px",
        marginBottom: "5px",
      }}
    >
      {movies.map((movie) => (
        <SwiperSlide
          key={movie.id}
          style={{
            borderRadius: "10px",
          }}
        >
          <Link href={`/movies/${movie.id}`}>
            <a>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                }}
                src={`${posterBaseUrl}/${movie.id}.jpg`}
                alt={movie.title}
              />
            </a>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HomeSwiper;
