import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import HomePage from "../component/layout/HomePage";
import Layout from "../component/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
