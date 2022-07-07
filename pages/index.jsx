import { useEffect, React } from "react";
import { getSession } from "next-auth/client";
import Router from "next/router";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
// import HomePage from "../component/layout/HomePage";
// import Layout from "../component/layout/Layout";

export default function Home({ user }) {
  useEffect(() => {
    if (user.id) Router.push("/dashboard");
    else {
      Router.push("/auth/login");
    }
  });
  return null;
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
