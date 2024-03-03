import React, { useState, Suspense } from "react";
import Spinner from "./Spinner";
import Image from "next/image";

const ImageComponent = ({ link, imagePlaceHolder, altTxt }: any) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <>{imagePlaceHolder} </>}
      <div className="relative h-12 w-10 rounded-lg">
        <Image
          src={link || "/loading_placeholder.jpg"}
          alt={altTxt || "not found"}
          fill
          sizes={`sizes="(max-width: 768px) 48px, (max-width: 1200px) 48px, 48px`}
          className={`rounded-lg object-cover ${isLoading && "hidden"}`}
          onLoad={handleLoad}
        />
      </div>
    </>
  );
};

const ShowImage = ({ row, imagePlaceholder }: any) => {
  const link = row?.getVisibleCells()[4]?.getValue() as string;
  const altTxt = row?.getVisibleCells()[1]?.getValue() as string;

  return (
    <Suspense fallback={<Spinner />}>
      <ImageComponent
        link={link}
        altTxt={altTxt}
        imagePlaceHolder={imagePlaceholder}
      />
    </Suspense>
  );
};

export default ShowImage;
