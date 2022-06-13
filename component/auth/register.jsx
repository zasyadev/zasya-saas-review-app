import { Form, Input, message } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import loginImage from "../../assets/images/login-image.png";

function RegisterPage() {
  const [registerForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    setLoading(true);
    values["role"] = 3;
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
    <section className="my-5">
      <div className="px-6 h-full text-gray-800">
        <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <Image src={loginImage} alt="login" />
          </div>
          <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
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
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="First Name"
                  />
                </Form.Item>
              </div>
              <div className="mb-6">
                <Form.Item name="last_name">
                  <Input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="Last Name"
                  />
                </Form.Item>
              </div>
              <div className="mb-6">
                <Form.Item name="company_name">
                  <Input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="Company Name"
                  />
                </Form.Item>
              </div>
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
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                    placeholder="Confirm Password"
                  />
                </Form.Item>
              </div>

              <div className=" md:flex justify-between text-center lg:text-left">
                <button
                  type="submit"
                  className="inline-block px-7 py-3 bg-green-500 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-green-600 hover:shadow-lg focus:bg-green-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-700 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Register
                </button>
                <p className="text-sm font-semibold mt-2 pt-1 mb-0">
                  <Link href="/auth/login">
                    <span className="text-green-600 hover:text-green-700 focus:text-green-700 transition duration-200 ease-in-out cursor-pointer">
                      Back to Login
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

export default RegisterPage;
