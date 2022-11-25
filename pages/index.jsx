import { useEffect } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated" && session) {
        Router.push("/dashboard");
      } else {
        Router.push("/auth/login");
      }
    }
  }, [session, status]);
}
