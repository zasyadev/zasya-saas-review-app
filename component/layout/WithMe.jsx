import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import { LoadingSpinner } from "../Loader/LoadingSpinner";
import { useRouter } from "next/router";
const WithMe = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [loading, session]);

  console.log("session", session);

  return loading ? (
    <LoadingSpinner />
  ) : !session ? (
    <LoadingSpinner />
  ) : (
    <div>{props.children(session)}</div>
  );
};

export default WithMe;
