import Link from "next/link";
import React from "react";

import UserAccountNav from "./UserAccountNav";
import { getAuthSession } from "@/lib/nextauth";
import SignInButton from "./signinButton";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed inset-x-0 top-0 bg-[#111] z-[10] h-fit border-b border-[#222] py-2 shadow-lg">
      <div className="flex items-center justify-between h-full gap-2 px-8 mx-auto max-w-7xl">
        {/* LEFT — LOGO */}
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <p className="rounded-lg border-2 border-b-4 border-r-4 border-white px-3 py-1 text-2xl font-extrabold transition-all hover:-translate-y-[2px] md:block text-black bg-white shadow-md" style={{ letterSpacing: '1px' }}>
            QuizLab
          </p>
        </Link>
        {/* RIGHT — User */}
        <div className="flex items-center gap-4">
          {session?.user ? (
            <UserAccountNav user={session.user} />
          ) : (
            <SignInButton text={"Sign In"} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
