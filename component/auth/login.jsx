import { Button, Form, Input, Spin } from "antd";
import { signIn } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import loginImage from "../../assets/images/login_img.png";
import { LoadingOutlined } from "@ant-design/icons";
import { LoadingSpinner } from "../Loader/LoadingSpinner";
import { openNotificationBox } from "../../helpers/notification";
import { HeadersComponent } from "../../helpers/HeadersComponent";
import AuthWrapper from "./AuthWrapper";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

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

      router.push("/dashboard");
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
          className="md:mb-6 mb-4"
          rules={[
            {
              required: true,
              message: "Please enter your email address!",
            },
          ]}
        >
          <Input
            type="text"
            className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
            placeholder="Email address"
          />
        </Form.Item>

        <div className="md:mb-8  mb-4">
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
            <Input.Password
              // type="password"
              className=" flex form-control w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
              placeholder="Password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
        </div>

        <div className=" md:block justify-between text-center lg:text-left mb-6">
          <button
            type="submit"
            className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
            disabled={loading}
          >
            {loading ? <Spin indicator={antIcon} /> : "Login"}
          </button>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="form-group form-check">
            <Link href="/forgotpassword">
              <p className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
                Forgot password ?
              </p>
            </Link>
          </div>
          <Link href="/auth/register">
            <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
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
      {/* // <section className="h-screen">
        //   <div className="text-gray-800">
        //     <div className="flex  md:justify-between justify-center items-center flex-wrap h-full g-6">
        //       <div className="md:w-1/2 w-full mb-12 md:mb-0 px-8 md:px-24 relative flex flex-col justify-center h-screen">
        //         <div className="login-top-image"></div>
        //         <h2 className="login-heading">Login to your account</h2>
        //         <Form
        //           form={loginForm}
        //           layout="vertical"
        //           autoComplete="off"
        //           onFinish={handleSubmit}
        //           className="login-form"
        //         >
        //           <Form.Item
        //             name="email"
        //             label="Email"
        //             className="md:mb-6 mb-4"
        //             rules={[
        //               {
        //                 required: true,
        //                 message: "Please enter your email address!",
        //               },
        //             ]}
        //           >
        //             <Input
        //               type="text"
        //               className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
        //               placeholder="Email address"
        //             />
        //           </Form.Item>

        //           <div className="md:mb-8  mb-4">
        //             <Form.Item
        //               name="password"
        //               label="Password"
        //               rules={[
        //                 {
        //                   required: true,
        //                   message: "Please enter your password!",
        //                 },
        //               ]}
        //             >
        //               <Input
        //                 type="password"
        //                 className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white  focus:outline-none"
        //                 placeholder="Password"
        //               />
        //             </Form.Item>
        //           </div>

        //           <div className=" md:block justify-between text-center lg:text-left mb-6">
        //             <button
        //               type="submit"
        //               className="inline-block px-7 py-5  text-white font-medium text-lg leading-snug  rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full btn-blue h-16"
        //             >
        //               Login
        //             </button>
        //           </div>

        //           <div className="flex justify-between items-center mb-6">
        //             <div className="form-group form-check">
        //               <Link href="/forgotpassword">
        //                 <p className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
        //                   Forgot password ?
        //                 </p>
        //               </Link>
        //             </div>
        //             <Link href="/auth/register">
        //               <span className="primary-color-blue  font-semibold transition duration-200 ease-in-out cursor-pointer underline">
        //                 Register
        //               </span>
        //             </Link>
        //           </div>
        //         </Form>
        //         <div className="login-bottom-image"></div>
        //       </div>
        //       <div className="md:w-1/2 w-full mb-12 md:mb-0 h-screen">
        //         <div className="login-image-wrapper h-full flex justify-center items-center">
        //           <Image src={loginImage} alt="login" />
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </section> */}
    </>
  );
}

export default LoginPage;
