import { Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AuthWrapper from "../../component/auth/AuthWrapper";
import { PrimaryButton } from "../../component/common/CustomButton";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";

function ForgotPassword() {
  const router = useRouter();
  const [forgotForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(values) {
    setLoading(true);
    let obj = {
      email: values.email,
    };
    if (obj.email) {
      await httpService
        .post(`/api/user/password/forgotpassword`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            forgotForm.resetFields();
            router.push("/auth/login");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          setLoading(false);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  const ForgotPasswordComponent = () => {
    return (
      <Form
        form={forgotForm}
        layout="vertical"
        autoComplete="off"
        onFinish={handleSubmit}
        className="login-form mx-2 md:mx-6"
      >
        <Form.Item
          name="email"
          className="mb-3 lg:mb-5"
          rules={[
            {
              required: true,
              message: "Please enter email ! ",
            },
          ]}
        >
          <Input
            type="text"
            className="form-control block w-full px-4 py-2 text-base xxl:text-lg font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="Email address"
          />
        </Form.Item>

        <PrimaryButton
          title="Submit"
          loading={loading}
          className="px-4 h-12 mt-2 text-white font-medium text-base xl:text-lg leading-snug shadow-md  hover:shadow-lg rounded  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue "
          type="submit"
        />

        <div className=" md:flex justify-end text-center lg:text-left">
          <p className="text-sm font-semibold mt-2 pt-1 mb-0">
            <Link href="/auth/login" passHref>
              <span className="text-primary-green  font-semibold transition duration-200 ease-in-out cursor-pointer">
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
