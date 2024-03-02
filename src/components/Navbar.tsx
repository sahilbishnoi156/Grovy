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

export default function Navbar() {
  return (
    <div className="py-3 px-6 border-b flex items-center justify-between fixed top-0 left-0 w-full backdrop-blur-sm z-50">
      <div className="space-x-8">
        <Link
          href={"/"}
          className="font-semibold text-lg flex items-center gap-2"
        >
          <GiAlienEgg size={25} className="text-orange-400" />
          Grovy
        </Link>
      </div>
      <div className="flex items-center justify-center gap-6">
        <ClerkLoading>
          <Spinner />
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
