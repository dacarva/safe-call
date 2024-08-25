"use client";
import { useUser } from "@/components/Context/UserContext";
import Welcome from "./src/Sections/Welcome";
import { SignIn } from "@/components/SignIn";

export default function Home() {
  const { user } = useUser();

  console.log("user", user);
  if (!user) {
    return <SignIn />;
  }

  return <Welcome />;
}
