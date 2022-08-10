import { useEffect } from "react";
import { getSession } from "next-auth/client";
import Router from "next/router";
// import LandingPage from "../component/layout/LandingPage";

// export default function homePage() {
//   return <LandingPage />;
// }

export default function Home({ user }) {
  useEffect(() => {
    if (user.id) Router.push("/dashboard");
    else {
      Router.push("/auth/login");
    }
  });
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
