import React from "react";
import SiderLayout from "../../component/layout/SiderLayout";
import Layout from "../../component/layout/Layout";
import { getSession } from "next-auth/client";

function dashboard({ user }) {
  return (
    // <Layout user={user}>
    <SiderLayout />
    // </Layout>
  );
}

export default dashboard;

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
