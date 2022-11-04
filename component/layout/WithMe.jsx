import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import WelcomeModal from "../common/WelcomeModal";
import LoadingSpinner from "../Loader/LoadingSpinner";
const WithMe = (props) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [notificationModal, setNotificationModal] = useState(false);

  // const handleNotificationModalOpen = () => {
  //   if (session) {
  //     localStorage.setItem("popUpTime", true);
  //     if (localStorage.getItem("popUpTime")) {
  //       const timerId = setTimeout(() => {
  //         setNotificationModal(true);
  //       }, 1000);
  //       return () => clearTimeout(timerId);
  //     }
  //   }
  // };

  // const handleNotificationModalClose = () => {
  //   localStorage.setItem("popUpTime", false);
  //   setNotificationModal(false);
  // };

  // useEffect(() => {
  //   handleNotificationModalOpen();
  // }, [session]);

  useEffect(() => {
    if (status !== "loading") {
      if (status === "unauthenticated" && !session) {
        let back_url = "";
        if (router.asPath) {
          back_url = `?back_url=${router.asPath}`;
        }
        router.push(`/auth/login${back_url}`);
      }
    }
  }, [status, session]);

  return status === "loading" ? (
    <LoadingSpinner />
  ) : !session ? (
    <LoadingSpinner />
  ) : (
    <div>
      {props.children(session)}
      {/* {session && session?.user?.id && (
        <WelcomeModal
          notificationModal={notificationModal}
          handleNotificationModalClose={handleNotificationModalClose}
          userId={session.user.id}
        />
      )} */}
    </div>
  );
};

export default WithMe;
