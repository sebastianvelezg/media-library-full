import Link from "next/link";
import RatingPieChart from "./RatingPieChart";

interface LatestMoviesCardProps {
  id?: number;
  poster: string;
  path: string;
  title: string;
  popularity: number;
  release_date: string;
  duration: number;
}

const LatestMoviesCard: React.FC<LatestMoviesCardProps> = ({
  id,
  poster,
  path,
  title,
  popularity,
  release_date,
  duration,
}) => {
  return (
    <Link href={`/movies/${id}`}>
      <div className="flex h-[103px]">
        <div
          className="max-w-sm rounded-md overflow-hidden shadow-lg bg-primary"
          style={{ width: "70px", height: "103px" }}
        >
          <img
            className="object-contain w-full h-full cursor-pointer"
            src={poster}
            alt=""
          />
        </div>
        <div className="flex items-center">
          <RatingPieChart popularity={popularity} />
        </div>
      </div>
    </Link>
  );
};

export default LatestMoviesCard;
