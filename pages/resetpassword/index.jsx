import React, { useState } from "react";
import Head from "next/head";
import { Form, Input, message } from "antd";
import { useRouter } from "next/router";
// import Layout from "../../component/layout/Layout";
import loginImage from "../../assets/images/login_img.png";
import Image from "next/image";
import Link from "next/link";
import { openNotificationBox } from "../../helpers/notification";
import { HeadersComponent } from "../../helpers/HeadersComponent";
import { LoadingSpinner } from "../../component/Loader/LoadingSpinner";
import AuthWrapper from "../../component/auth/AuthWrapper";
// import loginImage from "../../assets/images/login-image.png";
// import { LoadingSpinner } from "../../component/Loader/LoadingSpinner";

function ResetPassword() {
  const router = useRouter();
  const params = router.query;

  const [resetForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(values) {
    setLoading(true);
    let obj = {
      email: values.email,
      password: values.password,
      token: params.passtoken,
    };
    if (obj.token) {
      await fetch("/api/user/password/resetpassword", {
        method: "POST",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            openNotificationBox("success", data.message, 3);

            resetForm.resetFields();
            router.push("/auth/login");
          } else {
            openNotificationBox("error", data.message, 3);
          }
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }
  const ResetPasswordComponent = () => {
    return (
      <Form
        form={resetForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        className="login-form"
      >
        <div className="md:mb-6  mb-4">
          <Form.Item name="email">
            <Input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Email address"
            />
          </Form.Item>
        </div>

        <div className="md:mb-6  mb-4">
          <Form.Item name="password">
            <Input
              type="password"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="New Password"
            />
          </Form.Item>
        </div>
        <div className="md:mb-6  mb-4">
          <Form.Item
            name="confirm_password"
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
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

        <div className=" md:flex justify-between text-center lg:text-left">
          <button
            type="submit"
            className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
          >
            Submit
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
    );
  };
  return (
    <>
      <HeadersComponent />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <AuthWrapper
          FormComponent={ResetPasswordComponent}
          heading={"Reset Password"}
        />
      )}
      {/* <section className="h-screen">
        <div className="text-gray-800">
          <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="md:w-1/2 w-full mb-12 md:mb-0 px-8 md:px-24 relative flex flex-col justify-center h-screen">
              <div className="login-top-image"></div>

              <h2 className="login-heading">Reset Password</h2>
              <Form
                form={resetForm}
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
                className="login-form"
              >
                <div className="md:mb-6  mb-4">
                  <Form.Item name="email">
                    <Input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                      placeholder="Email address"
                    />
                  </Form.Item>
                </div>

                <div className="md:mb-6  mb-4">
                  <Form.Item name="password">
                    <Input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
                      placeholder="New Password"
                    />
                  </Form.Item>
                </div>
                <div className="md:mb-6  mb-4">
                  <Form.Item
                    name="confirm_password"
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
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

                <div className=" md:flex justify-between text-center lg:text-left">
                  <button
                    type="submit"
                    className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
                  >
                    Submit
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
              <div className="login-bottom-image"></div>
            </div>
            <div className="md:w-1/2 w-full mb-12 md:mb-0 h-screen">
              <div className="login-image-wrapper h-full flex justify-center items-center">
                <Image src={loginImage} alt="login" />
              </div>
            </div>
          </div>
        </div>
      </section> */}
    </>
  );
}

export default ResetPassword;
