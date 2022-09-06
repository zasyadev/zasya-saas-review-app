import { useEffect } from "react";
// import { getSession } from "next-auth/client";
import Router from "next/router";
import { useSession } from "next-auth/client";
// import LandingPage from "../component/layout/LandingPage";

// export default function homePage() {
//   return <LandingPage />;
// }

export default function Home() {
  const [session, loading] = useSession();
  useEffect(() => {
    if (!loading) {
      if (session) Router.push("/dashboard");
      else {
        Router.push("/auth/login");
      }
    }
  }, [session, loading]);
}
