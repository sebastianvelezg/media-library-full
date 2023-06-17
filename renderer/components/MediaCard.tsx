import Link from "next/link";

interface MediaCardProps {
  width: number;
  key: number;
  id?: number;
  title: string;
  overview: string;
  poster: string;
  backdrop: string;
  popularity: number;
  release_date: string;
  duration: number;
  path: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  width,
  key,
  id,
  title,
  overview,
  poster,
  backdrop,
  popularity,
  release_date,
  duration,
  path,
}) => {
  const height = width * 1.5;
  return (
    <Link href={`/movies/${id}`}>
      <a>
        <div
          className="max-w-sm rounded overflow-hidden shadow-lg  bg-primary cursor-pointer"
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <img
            className="w-full h-full object-cover"
            src={poster}
            alt={title}
          />
        </div>
      </a>
    </Link>
  );
};

export default MediaCard;
