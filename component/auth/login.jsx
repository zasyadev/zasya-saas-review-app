import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LoadingOutlined,
} from "@ant-design/icons";
import { Form, Input } from "antd";
import { signIn } from "next-auth/client";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import { openNotificationBox } from "../../component/common/notification";
import { PrimaryButton } from "../common/CustomButton";
import AuthWrapper from "./AuthWrapper";

function LoginPage() {
  const router = useRouter();
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values) {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result.error) {
        setLoading(false);
        openNotificationBox("error", result.error, 3);
        return;
      }
      if (router.query && router.query.back_url) {
        router.push(router.query.back_url);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      setLoading(false);
      openNotificationBox("error", error.message ?? "Failed", 3);
    }
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

  const LoginFormComponent = () => {
    return (
      <Form
        form={loginForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        className="login-form"
      >
        <Form.Item
          name="email"
          label="Email"
          className="mb-3 lg:mb-5"
          rules={[
            {
              required: true,
              message: "Please enter your email address!",
            },
          ]}
        >
          <Input
            type="text"
            className="form-control block w-full px-4 py-2 text-base xxl:text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="Email address"
          />
        </Form.Item>

        <Form.Item
          className="mb-3 lg:mb-5"
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input.Password
            // type="password"
            className=" flex form-control w-full px-4 py-2 text-base xxl:text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <PrimaryButton
          title="Login"
          loading={loading}
          className="px-4 h-12 mt-2 text-white font-medium text-base xl:text-lg leading-snug shadow-md  hover:shadow-lg rounded  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue "
          btnProps={{
            type: "submit",
          }}
        />

        <div className="flex justify-between items-center mt-4 mb-6">
          <div className="form-group form-check">
            <Link href="/forgotpassword" passHref>
              <p className="text-primary  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
                Forgot password ?
              </p>
            </Link>
          </div>
          <Link href="/auth/register" passHref>
            <span className="text-primary  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
              Register
            </span>
          </Link>
        </div>
      </Form>
    );
  };

  return (
    <>
      <HeadersComponent />

      <AuthWrapper
        FormComponent={LoginFormComponent}
        heading={"Login to your account"}
      />
    </>
  );
}

export default LoginPage;
