import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { LoadingSpinner } from "../Loader/LoadingSpinner";
const WithMe = (props) => {
  const router = useRouter();
  const [session, loading] = useSession();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/auth/login");
    }
  }, [loading, session]);

  return loading ? (
    <LoadingSpinner />
  ) : !session ? (
    <LoadingSpinner />
  ) : (
    <div>{props.children(session)}</div>
  );
};

export default WithMe;
