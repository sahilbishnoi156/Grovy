"use client"
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { HamburgerIcon } from "./HamburgerIcon";
import { GiAlienEgg } from "react-icons/gi";
import Spinner from "./Spinner";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <div className="py-3 px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50">
      <div className="text-xl">
        {pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1, pathname.length)}
      </div>
      <div className="flex items-center justify-center gap-6">
        <ClerkLoading>
          <Spinner color="dark:text-white text-black" />
        </ClerkLoading>
        <ClerkLoaded>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton afterSignInUrl="/" mode="modal">
              <Button size={"sm"} variant="default">
                Log in
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>

        <HamburgerIcon />
      </div>
    </div>
  );
}
