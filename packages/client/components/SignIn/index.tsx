"use client";
import Welcome from "@/app/src/Sections/Welcome";
import { signIn, signOut, useSession } from "next-auth/react";

export const SignIn = () => {
  const { data: session } = useSession();
  console.log("session aaaaaaaaaaaaaaaaaaa", session);

  if (!session) {
    signIn();
  }

  if (session) {
    return (
      <>
        {/* This will be removed for the final version */}
        {/* <div className="fixed top-0 ">
          Signed in as {session?.user?.name?.slice(0, 10)} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div> */}
        <Welcome />
      </>
    );
  }
};
