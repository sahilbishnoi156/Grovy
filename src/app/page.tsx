// "use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { GiAlienEgg } from "react-icons/gi";
import { MdOutlineExplore } from "react-icons/md";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-[90vh]">
      <div className="flex w-full lg:flex-row flex-col-reverse">
        <div className="lg:w-2/5 w-full flex flex-col items-start justify-center px-2 lg:px-16">
          <h1 className="text-6xl -ml-1 space-x-8">
            <Link
              href={"/"}
              className="font-semibold flex items-center gap-2"
            >
              <GiAlienEgg size={45} className="text-orange-400" />
              Grovy
            </Link>
          </h1>
          <h3 className="text-2xl">My Personal library</h3>
          <p className="text-neutral-500 mt-8">
            Create your tasks, drawing&lsquo;s and upload files and attach them with your tasks. Create timebound tasks so you can get notified before time and you can  complete them easyly.
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
        <div className="lg:w-3/5 w-full justify-center relative h-[90vh] lg:flex hidden ">
          <span className="absolute top-[30%] right-[32%] text-3xl -rotate-12 z-[1] hover:-rotate-6 duration-200 lg:block hidden">
            Create
          </span>
          <span className="absolute top-[40%] right-[22%] text-3xl rotate-45 z-[1] hover:rotate-12 duration-200 lg:block hidden">
            Delete
          </span>
          <video
            src="/grovyHomePageVideo2.mp4"
            className="w-[30rem] rounded-lg absolute lg:top-24 top-7 lg:left-20 left-8 object-contain border border-dashed hover:-rotate-6 duration-200"
            autoPlay
            muted
            loop
          ></video>
          <span className="absolute bottom-[30%] left-[22%] text-3xl z-[1] rotate-12 hover:-rotate-6 duration-200 lg:block hidden">
            Upload
          </span>
          <video
            src="/grovyHomePageVideo.mp4"
            className="w-[26rem] rounded-lg absolute lg:bottom-[20%] bottom-[10%] lg:right-[10%] right-[2%] object-contain border border-dashed hover:rotate-6 duration-200"
            autoPlay
            muted
            loop
          ></video>
        </div>
      </div>
    </main>
  );
}
