import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { HamburgerIcon } from "./HamburgerIcon";

export default function Navbar() {
  return (
    <div className="py-3 px-6 border-b flex items-center justify-between fixed top-0 left-0 w-full backdrop-blur-sm z-[51]">
      <div className="space-x-8">
        <Link href={"/"} className="font-semibold text-xl">
          Voider
        </Link>
      </div>
      <div className="flex items-center justify-center gap-6">
        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <SignInButton afterSignInUrl="/" mode="modal">
            <Button size={"sm"} variant="default">
              Log in
            </Button>
          </SignInButton>
        </SignedOut>
        <HamburgerIcon/>
      </div>
    </div>
  );
}
