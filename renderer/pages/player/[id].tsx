import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import Link from "next/link";

const VideoPlayer: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const playerRef = useRef(null);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const fetchVideo = async () => {
        const { ipcRenderer } = window.require("electron");
        const videoSrc: string = await ipcRenderer.invoke(
          "fetch-video-by-id",
          id
        );

        if (playerRef.current) {
          const player = videojs(playerRef.current);
          player.src({ type: "video/mp4", src: videoSrc });
        }
      };

      fetchVideo();
    }
  }, [router.isReady, id]);

  useEffect(() => {
    return () => {
      if (playerRef.current) {
        const player = videojs(playerRef.current);
        player.dispose();
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const mouseMoved = () => {
      setIsButtonVisible(true);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsButtonVisible(false), 5000); // 5000 ms = 5 seconds
    };
    window.addEventListener("mousemove", mouseMoved);
    return () => window.removeEventListener("mousemove", mouseMoved);
  }, []);

  return (
    <div
      style={{ width: "100vw", height: "100vh", padding: "0px" }}
      className="custom-scrollbar"
    >
      {isButtonVisible && (
        <div>
          <Link href={`/movies/${id}`}>
            <a className="inline-block px-6 py-2 text-xs font-medium text-center text-white bg-secondary uppercase transition rounded shadow ripple hover:shadow-lg hover:bg-primary focus:outline-none mb-2">
              Back
            </a>
          </Link>
        </div>
      )}
      <div data-vjs-player>
        <video
          ref={playerRef}
          id="my-player"
          className="video-js vjs-fill"
          controls
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
