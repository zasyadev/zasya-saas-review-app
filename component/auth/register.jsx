import Link from "next/link";
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Checkbox, message, Spin } from "antd";

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
                <Form.Item name="confirm_password">
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
