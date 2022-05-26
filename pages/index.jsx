import { getSession } from "next-auth/client";
// import Head from "next/head";
// import Image from "next/image";
// import Link from "next/link";
import HomePage from "../component/layout/HomePage";
import Layout from "../component/layout/Layout";

export default function Home({ user }) {
  return (
    <Layout user={user}>
      <HomePage />
    </Layout>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      props: {},
    };
  }
  const { user } = session;
  return {
    props: { user },
  };
}
