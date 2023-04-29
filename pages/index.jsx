import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated" && session) {
        router.push("/dashboard");
      } else {
        router.push("/auth/login");
      }
    }
  }, [session, status, router]);
}
