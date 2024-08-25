"use client";
import { useUser } from "@/components/Context/UserContext";
import Welcome from "./src/Sections/Welcome";
import { SignIn } from "@/components/SignIn";

export default function Home() {
  // @dev: DISCOMENT THIS IS THE LOGIN
  // const { user } = useUser();

  // if (!user) {
  //   return <SignIn />;
  // }
  return <Welcome />;
}
