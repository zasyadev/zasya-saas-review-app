import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { URLS } from "../../constants/urls";
import ReviewPopUpModal from "../common/ReviewPopUpModal";
import LoadingSpinner from "../Loader/LoadingSpinner";

const WithMe = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      if (status === "unauthenticated" && !session) {
        let back_url = "";
        if (router.asPath) {
          back_url = `?back_url=${router.asPath}`;
        }
        router.replace(`/auth/login${back_url}`);
      }
    }
  }, [status, session]);

  return status === "loading" ? (
    <LoadingSpinner />
  ) : !session ? (
    <LoadingSpinner />
  ) : (
    <>
      {props.children(session)}
      {session &&
        session?.user?.id &&
        [
          URLS.DASHBOARD,
          URLS.REVIEW_RECEIVED,
          URLS.REVIEW_CREATED,
          URLS.APPLAUD,
          URLS.TEMPLATE,
          URLS.PROFILE,
          URLS.ALL_APPLAUD,
          URLS.SURVEY,
        ].includes(router?.pathname) && (
          <ReviewPopUpModal userId={session.user.id} />
        )}
    </>
  );
};

export default WithMe;
