import React from "react";
import Link from "next/link";

interface RatingProps {
  key?: number;
  id?: number;
  popularity: number;
}

const RatingPieChart: React.FC<RatingProps> = ({ key, id, popularity }) => {
  const ratingPercentage = popularity * 10; // Adjust the rating to be percentage based
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - ratingPercentage) / 100) * circumference;

  return (
    <Link href={`/movies/${id}`}>
      <div style={{ position: "relative", width: "60px", height: "60px" }}>
        <svg className="progress-ring" width="60" height="60">
          <circle
            className="progress-ring__circle"
            stroke="white"
            strokeDasharray={circumference + " " + circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.35s",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
          <circle
            className="progress-ring__circle"
            stroke={`rgba(${255 * (1 - ratingPercentage / 100)}, ${
              255 * (ratingPercentage / 100)
            }, 0)`}
            strokeDasharray={circumference + " " + circumference}
            style={{
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 0.35s",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
            }}
            strokeWidth="4"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
        </svg>
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontWeight: "bold",
            fontSize: "15px",
          }}
        >
          {ratingPercentage.toFixed()}%
        </span>
      </div>
    </Link>
  );
};

export default RatingPieChart;
