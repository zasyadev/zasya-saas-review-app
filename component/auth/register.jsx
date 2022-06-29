import { Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import loginImage from "../../assets/images/login_img.png";
import { LoadingSpinner } from "../Loader/LoadingSpinner";

function RegisterPage() {
  const [registerForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    setLoading(true);
    values["role"] = 2;
    values["status"] = 1;
    await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(values),
      // headers: {
      //   "Content-Type": "application/json",
      // },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          message.success(data.message, 3);
          registerForm.resetFields();
          // setRegisterToggle(false);
        }
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="">
          <div className=" text-gray-800">
            <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6">
              <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
                <h2 className="login-heading">Register New account</h2>
                <Form
                  form={registerForm}
                  layout="vertical"
                  autoComplete="off"
                  onFinish={handleSubmit}
                >
                  <div className="mb-6">
                    <Form.Item name="first_name">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="First Name"
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-6">
                    <Form.Item name="last_name">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Last Name"
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-6">
                    <Form.Item name="company_name">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Company Name"
                      />
                    </Form.Item>
                  </div>
                  <div className="mb-6">
                    <Form.Item name="email">
                      <Input
                        type="text"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
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
                  <div className="mb-6">
                    <Form.Item
                      name="confirm_password"
                      rules={[
                        {
                          required: true,
                          message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            console.log(value, "sdfsdjkhfjksh");
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                "The two passwords that you entered do not match!"
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input
                        type="password"
                        className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                        placeholder="Confirm Password"
                      />
                    </Form.Item>
                  </div>

                  <div className=" md:block justify-between text-center lg:text-left mb-2">
                    <button
                      type="submit"
                      className="inline-block px-7 py-3  text-white font-medium text-sm leading-snug uppercase rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue"
                    >
                      Register
                    </button>
                  </div>

                  <div className=" md:flex justify-end text-center lg:text-left">
                    <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                      <Link href="/auth/login">
                        <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer">
                          Back to Login
                        </span>
                      </Link>
                    </p>
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

export default RegisterPage;
