import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center h-[91vh] flex-col">
      <h1 className="text-6xl">Voider</h1>
      <p className="text-neutral-500">My Personal Library</p>
      <Button variant={"primary"} className="mt-10">
        <Link href={"/files"}>Try it now &rarr;</Link>
      </Button>
    </main>
  );
}
