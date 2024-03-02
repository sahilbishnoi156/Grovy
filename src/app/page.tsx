// "use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { MdOutlineExplore } from "react-icons/md";

export default function Home() {
  // const [status, setStatus] = React.useState('')
  // React.useEffect(() => {
  //   console.log(navigator);
  //   const handleNetworkChange = () => {
  //     console.log(navigator.onLine);
  //     setStatus(navigator.onLine ? 'online' : 'offline');
  //   };

  //   window.addEventListener('load', () => {
  //     handleNetworkChange();
  //     window.addEventListener('online', handleNetworkChange);
  //     window.addEventListener('offline', handleNetworkChange);
  //   });

  //   // Cleanup event listeners on component unmount
  //   return () => {
  //     window.removeEventListener('online', handleNetworkChange);
  //     window.removeEventListener('offline', handleNetworkChange);
  //   };
  // }, []);

  return (
    <main className="flex items-center justify-center min-h-[90vh]">
      <div className="flex w-full">
        <div className="w-2/5 flex flex-col items-start justify-center px-16">
          <h1 className="text-6xl -ml-1">Grovy</h1>
          {/* <span>status:</span> */}
          <h3 className="text-2xl">My Personal library</h3>
          <p className="text-neutral-500 mt-8">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda
            vero earum voluptatum, rem cupiditate quasi necessitatibus illum
            repellendus? Officiis illum quibusdam autem odit veniam alias
            sapiente mollitia velit, expedita dolorum.
          </p>
          <Button variant={"primary"} className="mt-3 group">
            <Link href={"/files"} className="flex items-center gap-2 text-lg">
              Explore{" "}
              <MdOutlineExplore
                size={20}
                className="mt-[1.6px] group-hover:rotate-90 duration-200"
              />
            </Link>
          </Button>
        </div>
        <div className="w-3/5 flex justify-center relative h-[90vh]">
          <video
            src="https://firebasestorage.googleapis.com/v0/b/dropbox-clone-2de2b.appspot.com/o/users%2Fuser_2ciZaSDYBHaCi49X89L0Gr2MX1i%2Ffiles%2FuqgjZ4PUH7V7q7Od5hWT?alt=media&token=bccee1d1-70e7-4d7c-a097-2816d343faa5"
            className="w-[30rem] rounded-lg absolute top-10 left-20 h-[30rem] object-cover"
          ></video>
          <video
            src="/grovyHomePageVideo.mp4"
            className="w-[26rem] rounded-lg absolute bottom-12 right-[10%] h-[26rem] object-cover"
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>
    </main>
  );
}
