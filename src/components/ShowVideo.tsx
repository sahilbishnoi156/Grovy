import React, { useState, useRef, Suspense } from "react";
import Spinner from "./Spinner";

const VideoComponent = ({ videoSource, videoPlaceHolder }: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleHover = () => {
    videoRef?.current?.play();
  };

  const handleLeave = () => {
    videoRef?.current?.pause();
    videoRef.current.currentTime = 0;
  };

  React.useEffect(() => {
    videoRef?.current?.addEventListener("timeupdate", () => {
      if (videoRef?.current?.currentTime === videoRef?.current?.duration) {
        videoRef.current.currentTime = 0;
      }
    });

    // Cleanup event listener on component unmount
    return () => {
      videoRef?.current?.removeEventListener("timeupdate", () => {});
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="relative h-12 w-10 rounded-lg flex items-center justify-center"
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      {isLoading && (
        <>
          {videoPlaceHolder}
          <div className=" inline-flex space-x-2 justify-center items-center h-12 absolute -left-[0.8px] z-50">
            <span className="sr-only">Loading...</span>
            <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-1 w-1 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        </>
      )}
      <video
        ref={videoRef}
        preload="metadata"
        muted
        className={`h-full w-full object-cover rounded-lg ${
          isLoading ? "hidden" : ""
        }`}
        onLoadedData={handleLoad}
      >
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const ShowVideo = ({ row, videoPlaceHolder }: any) => {
  const videoSource = row?.getVisibleCells()[4]?.getValue() as string;
  console.log(videoSource)
  return (
    <Suspense fallback={<Spinner />}>
      <VideoComponent
        videoSource={videoSource}
        videoPlaceHolder={videoPlaceHolder}
      />
    </Suspense>
  );
};

export default ShowVideo;
