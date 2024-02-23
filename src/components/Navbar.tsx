import { SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return (
    <div className="py-3 px-6 border-b flex items-center justify-between fixed top-0 left-0 w-full backdrop-blur-sm">
      <div className="space-x-8">
        <Link href={"/"} className="font-semibold text-xl">
          Voider
        </Link>
        <Link href={"/files"}>files</Link>
        <Link href={"/tasks"}>tasks</Link>
      </div>
      <div className="flex items-center justify-center gap-6">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
        <SignedOut>
          <SignInButton afterSignInUrl="/tasks" mode="modal">
            <Button size={"sm"} variant="default">
              Sign in
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
