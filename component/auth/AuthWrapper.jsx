import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

function AuthWrapper({ FormComponent, heading }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading") {
      if (status === "authenticated" && session) {
        if (router.query && router.query.back_url) {
          router.replace(router.query.back_url);
        } else {
          router.replace("/dashboard");
        }
      }
    }
  }, [status, session]);

  if (status === "loading" || session) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 xl:gap-8 h-full ">
      <div className="py-6 px-10 md:px-4 lg:px-16 h-full flex items-center justify-center overflow-y-auto no-scrollbar xl:w-5/6 xl:mx-auto">
        <div className="w-full flex flex-col justify-center max-w-xl">
          <div className="h-24 2xl:h-28 grid place-content-center  w-full cursor-pointer px-3">
            <Image
              src={"/media/images/logos/review_app.png"}
              width={100}
              height={51}
              alt="review_logo"
            />
          </div>
          <h2 className="text-xl 2xl:text-2xl font-bold mb-6 2xl:mb-8  text-center">
            {heading}
          </h2>
          <FormComponent />
        </div>
      </div>
      <div className="login-image-wrapper hidden md:grid place-content-center h-full bg-primary-gray">
        <div className="relative image-wrapper">
          <Image
            src={"/media/images/bg/login_img.webp"}
            alt="login"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}

export default AuthWrapper;
