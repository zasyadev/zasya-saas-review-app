import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Form, Input } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import AuthWrapper from "../../component/auth/AuthWrapper";
import { PrimaryButton } from "../../component/common/CustomButton";
import { HeadersComponent } from "../../component/common/HeadersComponent";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";

function ResetPassword() {
  const router = useRouter();
  const params = router.query;
  const [resetForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  async function handleSubmit(values) {
    setLoading(true);
    let obj = {
      password: values.password,
      token: params.passtoken,
    };
    if (obj.token) {
      await httpService
        .post(`/api/user/password/resetpassword`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);

            resetForm.resetFields();
            router.push("/auth/login");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          openNotificationBox("error", err.response.data?.message);
          setLoading(false);
        });
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
        <Form.Item
          name="password"
          className="mb-3 lg:mb-5"
          rules={[
            {
              required: true,
              message: "Please enter your password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            className="flex form-control w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="New Password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          className="mb-3 lg:mb-5"
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
                  new Error("The password that you have entered did not match!")
                );
              },
            }),
          ]}
        >
          <Input
            type="password"
            className="flex form-control  w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="Confirm Password"
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
              <span className="text-primary  font-semibold transition duration-200 ease-in-out cursor-pointer">
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
        FormComponent={ResetPasswordComponent}
        heading={"Reset Password"}
      />
    </>
  );
}

export default ResetPassword;
