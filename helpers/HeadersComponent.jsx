import Head from "next/head";
import React from "react";

export function HeadersComponent() {
  return (
    <Head>
      <title>Review App</title>
      <meta name="description" content="Review App" />
      <link rel="icon" href="/media/images/review-small.png" />
    </Head>
  );
}
