import React, { useState } from "react";
// import Head from "next/head";
import { Form, Input } from "antd";
import { useRouter } from "next/router";
// import Layout from "../../component/layout/Layout";
import loginImage from "../../assets/images/login_img.png";
import Image from "next/image";
import Link from "next/link";
import { openNotificationBox } from "../../helpers/notification";
import { HeadersComponent } from "../../helpers/HeadersComponent";
import AuthWrapper from "../../component/auth/AuthWrapper";
// import loginImage from "../../assets/images/login-image.png";
// import { LoadingSpinner } from "../../component/Loader/LoadingSpinner";

function ForgotPassword() {
  const router = useRouter();
  const params = router.query;

  const [forgotForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(values) {
    setLoading(true);
    let obj = {
      email: values.email,
    };
    if (obj.email) {
      await fetch("/api/user/password/forgotpassword", {
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
            forgotForm.resetFields();
            router.push("/auth/login");
          } else {
            openNotificationBox("error", data.message, 3);
          }
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }
  const ForgotPasswordComponent = () => {
    return (
      <Form
        form={forgotForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        className="login-form"
      >
        <div className="md:mb-10  mb-4">
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please enter email!",
              },
            ]}
          >
            <Input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Email address"
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
      <AuthWrapper
        FormComponent={ForgotPasswordComponent}
        heading={"Forgot Password"}
      />
    </>
  );
}

export default ForgotPassword;
