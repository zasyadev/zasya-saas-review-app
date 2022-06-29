import { Form, Input, message } from "antd";
import { signIn } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import loginImage from "../../assets/images/login_img.png";
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
    router.replace("/admin/dashboard");
  }
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="h-screen">
          <div className="text-gray-800">
            <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6">
              <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                <h2 className="login-heading">Login to your account</h2>
                <Form
                  form={loginForm}
                  layout="vertical"
                  autoComplete="off"
                  onFinish={handleSubmit}
                >
                  <div className="mb-6">
                    <Form.Item name="email">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Email address"
                      />
                    </Form.Item>
                  </div>

                  <div className="mb-6">
                    <Form.Item name="password">
                      <Input
                        type="password"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Password"
                      />
                    </Form.Item>
                  </div>

                  <div className=" md:block justify-between text-center lg:text-left mb-2">
                    <button
                      type="submit"
                      className="inline-block px-7 py-3  text-white font-medium text-sm leading-snug uppercase rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue"
                    >
                      Login
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <div className="form-group form-check">
                      <a href="#!" className="text-gray-800">
                        Forgot password?
                      </a>
                    </div>
                    <Link href="/auth/register">
                      <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer">
                        Register
                      </span>
                    </Link>
                  </div>
                </Form>
              </div>
              <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0 h-screen">
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
