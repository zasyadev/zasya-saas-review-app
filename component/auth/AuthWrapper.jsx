import { Col, Row } from "antd";
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
    <Row className="h-full" align="stretch">
      <Col xs={24} md={12} lg={12}>
        <div className="py-6 px-4 md:px-8 lg:px-16 h-full flex items-center justify-center overflow-y-auto no-scrollbar">
          <div className="w-full flex flex-col justify-center max-w-xl">
            <div className="h-24 2xl:h-28 grid place-content-center text-center w-full cursor-pointer px-3">
              <Image
                src={"/media/images/logos/review_app.png"}
                width={100}
                height={51}
                alt="review_logo"
              />
            </div>
            <h2 className="text-xl xl:text-2xl font-bold mb-4  text-center">
              {heading}
            </h2>
            <FormComponent />
          </div>
        </div>
      </Col>
      <Col xs={24} md={12} lg={12} className="hidden md:block">
        <div className="login-image-wrapper hidden md:grid place-content-center h-full bg-primary-gray">
          <div className="relative image-wrapper">
            <Image
              src={"/media/images/bg/login_img.webp"}
              alt="login"
              layout="fill"
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default AuthWrapper;
