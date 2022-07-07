import { Form, Input, message } from "antd";
import Head from "next/head";
import { signIn } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import loginImage from "../../assets/images/login_img.png";
import loginTopImage from "../../assets/images/login-top-design.png";
import loginBottomImage from "../../assets/images/login-bottom-design.png";
import { LoadingSpinner } from "../Loader/LoadingSpinner";

function LoginPage() {
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result.error) {
      message.error(result.error, 3);

      setLoading(false);
      return;
    }
    router.replace("/dashboard");
  }
  return (
    <>
      <Head>
        <title>Review App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="h-screen">
          <div className="text-gray-800">
            <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6">
              <div className="md:w-1/2 w-full mb-12 md:mb-0 px-8 md:px-24 relative flex flex-col justify-center h-screen">
                <div className="login-top-image"></div>
                <h2 className="login-heading">Login to your account</h2>
                <Form
                  form={loginForm}
                  layout="vertical"
                  autoComplete="off"
                  onFinish={handleSubmit}
                  className="login-form"
                >
                  <div className="md:mb-6  mb-4">
                    <Form.Item name="email" label="Email">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Email address"
                      />
                    </Form.Item>
                  </div>

                  <div className="md:mb-8  mb-4">
                    <Form.Item name="password" label="Password">
                      <Input
                        type="password"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Password"
                      />
                    </Form.Item>
                  </div>

                  <div className=" md:block justify-between text-center lg:text-left mb-6">
                    <button
                      type="submit"
                      className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
                    >
                      Login
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="form-group form-check">
                      <a
                        href="#!"
                        className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline"
                      >
                        Forgot password ?
                      </a>
                    </div>
                    <Link href="/auth/register">
                      <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
                        Register
                      </span>
                    </Link>
                  </div>
                </Form>
                <div className="login-bottom-image"></div>
              </div>
              <div className="md:w-1/2 w-full mb-12 md:mb-0 h-screen">
                <div className="login-image-wrapper h-full flex justify-center items-center">
                  <Image src={loginImage} alt="login" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default LoginPage;
