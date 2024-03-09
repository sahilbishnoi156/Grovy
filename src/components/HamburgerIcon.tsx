"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CgMenuLeft } from "react-icons/cg";
import { LuFiles } from "react-icons/lu";
import { CgGoogleTasks } from "react-icons/cg";
import { PiSignOutBold } from "react-icons/pi";
import { ThemeToggle } from "./ThemeToggle";
import { Calendar, Moon, Sun } from "lucide-react";
import { LuLock } from "react-icons/lu";
import { CiCalendarDate } from "react-icons/ci";
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";
import React from "react";
import Link from "next/link";
import { GiAlienEgg } from "react-icons/gi";

export function HamburgerIcon() {
  const { user } = useUser();
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <Sheet onOpenChange={(isOpen) => setIsOpen(isOpen)} open={isOpen}>
      <SheetTrigger asChild>
        <div>
          <CgMenuLeft
            size={25}
            className="cursor-pointer hover:-rotate-45 duration-150"
          />
        </div>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            <Link href={"/"} className="font-semibold flex items-center gap-2">
              <GiAlienEgg size={30} className="text-orange-400" />
              Grovy
            </Link>
          </SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <SignedIn>
            <WhenSignedInButtons user={user} setIsOpen={setIsOpen} />
          </SignedIn>
          <SignedOut>
            <WhenSignedOutButtons user={user} setIsOpen={setIsOpen} />
          </SignedOut>
          <SheetClose asChild className="mt-0">
            <Button variant={"secondary"} className="h-12">
              Close
            </Button>
          </SheetClose>
          <div className="flex items-center justify-start gap-1 text-xs text-neutral-400">
            Last updated: 
            <Calendar size={13} />
            <span>03/09/2024</span>
            <span className="sr-only">Last updated time</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const WhenSignedInButtons = ({ user, setIsOpen }: any) => {
  return (
    <div className="grid gap-4 pt-5">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage
            src={
              user?.hasImage ? user?.imageUrl : "https://github.com/shadcn.png"
            }
            alt={user?.fullName || "voiderUser"}
          />
          <AvatarFallback>{user?.fullName || "voiderUser"}</AvatarFallback>
        </Avatar>
        <span>{user?.fullName || "Voider user"}</span>
        <span className="sr-only">Logged In User</span>
      </div>
      <Link href={"/tasks"} className="w-full">
        <Button
          variant={"ghost"}
          className="justify-start gap-3 text-md h-12 group w-full pl-2"
          onClick={() => setIsOpen(false)}
        >
          <CgGoogleTasks className="h-[1.3rem] w-[1.3rem] transition-all group-hover:scale-110" />
          <span>Tasks</span>
          <span className="sr-only">Tasks</span>
        </Button>
      </Link>
      <Link href={"/files"} className="w-full">
        <Button
          variant={"ghost"}
          className="justify-start gap-3 text-md h-12 group w-full pl-2"
          onClick={() => setIsOpen(false)}
        >
          <LuFiles className="h-[1.3rem] w-[1.3rem] transition-all group-hover:scale-110" />
          <span>Files</span>
          <span className="sr-only">Files</span>
        </Button>
      </Link>
      <ThemeToggle>
        <Button
          variant={"ghost"}
          className="justify-start gap-3 text-md h-12 group pl-2"
        >
          <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:dark:scale-110" />
          <span className="sr-only">Toggle theme</span>
          <span>Toggle theme</span>
        </Button>
      </ThemeToggle>
      <SignedIn>
        <SignOutButton>
          <Button
            variant={"ghost"}
            className="justify-start gap-3 text-md h-12 group text-red-400 hover:text-red-600 pl-2"
            onClick={() => setIsOpen(false)}
          >
            <PiSignOutBold
              className="cursor-pointer group-hover:scale-110 transition-all"
              size={20}
            />
            <span className="sr-only">LogOut</span>
            <span>Logout</span>
          </Button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
};
const WhenSignedOutButtons = ({ user, setIsOpen }: any) => {
  return (
    <div className="grid gap-4 pt-5">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage
            src={
              user?.hasImage ? user?.imageUrl : "https://github.com/shadcn.png"
            }
            alt={user?.fullName || "voiderUser"}
          />
          <AvatarFallback>{user?.fullName || "voiderUser"}</AvatarFallback>
        </Avatar>
        <span>{user?.fullName || "Voider user"}</span>
        <span className="sr-only">Logged In User</span>
      </div>
      <Button
        variant={"ghost"}
        className="justify-start gap-3 text-md h-12 group pl-3"
        disabled
      >
        <LuLock className="h-[1.3rem] w-[1.3rem] transition-all group-hover:scale-110" />
        <span>Files</span>
        <span className="sr-only">Files</span>
      </Button>
      <Button
        variant={"ghost"}
        className="justify-start gap-3 text-md h-12 group pl-3"
        disabled
      >
        <LuLock className="h-[1.3rem] w-[1.3rem] transition-all group-hover:scale-110" />
        <span>Tasks</span>
        <span className="sr-only">Tasks</span>
      </Button>
      <ThemeToggle>
        <Button
          variant={"ghost"}
          className="justify-start gap-3 text-md h-12 group pl-3"
        >
          <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 group-hover:dark:scale-110" />
          <span className="sr-only">Toggle theme</span>
          <span>Toggle theme</span>
        </Button>
      </ThemeToggle>
      <SignInButton afterSignInUrl="/" mode="modal">
        <Button size={"lg"} variant="primary" onClick={() => setIsOpen(false)}>
          Log in
          <span className="sr-only">Log in</span>
        </Button>
      </SignInButton>
    </div>
  );
};
