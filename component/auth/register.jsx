import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { Form, Input, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";
import AuthWrapper from "./AuthWrapper";

function RegisterPage() {
  const router = useRouter();
  const [registerForm] = Form.useForm();

  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    setLoading(true);
    values["role"] = 2;
    values["status"] = 1;

    await httpService
      .post(`/api/user`, values)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          registerForm.resetFields();
          router.push("/auth/login");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.response.data.message);
        openNotificationBox("error", err.response.data.message);
      });
  }
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "white",
      }}
      spin
    />
  );

  const FormComponent = () => {
    return (
      <Form
        form={registerForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        className="login-form"
      >
        <Form.Item
          className="mb-5"
          name="first_name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please enter your full name!",
            },
          ]}
        >
          <Input
            type="text"
            className="form-control block w-full  px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder=" Name"
          />
        </Form.Item>

        <div className="mb-5">
          <Form.Item
            name="company_name"
            label="Company Name"
            rules={[
              {
                required: true,
                message: "Please enter your company name!",
              },
            ]}
          >
            <Input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Company Name"
            />
          </Form.Item>
        </div>
        <div className="mb-5">
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Please enter your email!",
              },
            ]}
          >
            <Input
              type="text"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:outline-none"
              placeholder="Email address"
            />
          </Form.Item>
        </div>
        <div className="mb-5">
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please enter your password!",
              },
            ]}
          >
            <Input
              type="password"
              className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Password"
            />
          </Form.Item>
        </div>
        <div className="mb-5">
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            rules={[
              {
                required: true,
                message: "Please enter confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The  password that you have entered did not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              // type="password"
              className="flex form-control w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Confirm Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </div>

        <div className=" md:block justify-between text-center lg:text-left mb-2">
          <button
            type="submit"
            className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
            disabled={loading}
          >
            {loading ? <Spin indicator={antIcon} /> : "Register"}
          </button>
        </div>

        <div className=" md:flex justify-end text-center lg:text-left">
          <p className="text-sm font-semibold mt-2 pt-1 mb-0">
            <Link href="/auth/login">
              <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer mb-2">
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
        FormComponent={FormComponent}
        heading={"Register New account"}
      />
    </>
  );
}

export default RegisterPage;
