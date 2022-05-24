import Link from "next/link";
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, message, Spin } from "antd";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

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
    <section className="h-screen">
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="w-full"
              alt="Sample image"
            />
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
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
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="Email address"
                  />
                </Form.Item>
              </div>

              <div className="mb-6">
                <Form.Item name="password">
                  <Input
                    type="password"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="Password"
                  />
                </Form.Item>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-green-500 checked:border-green-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  />
                  <label
                    className="form-check-label inline-block text-gray-800"
                    htmlFor="exampleCheck2"
                  >
                    Remember me
                  </label>
                </div>
                <a href="#!" className="text-gray-800">
                  Forgot password?
                </a>
              </div>

              <div className=" md:flex justify-between text-center lg:text-left">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-green-500 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Login
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  Don't have an account?{" "}
                  <Link href="/auth/register">
                    <span className="text-green-600 hover:text-green-700 focus:text-green-700 transition duration-200 ease-in-out cursor-pointer">
                      Register
                    </span>
                  </Link>
                </p>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
