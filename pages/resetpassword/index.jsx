import React, { useState } from "react";
import { Form, Input, message } from "antd";
import { useRouter } from "next/router";
import Layout from "../../component/layout/Layout";
// import loginImage from "../../assets/images/login-image.png";
// import { LoadingSpinner } from "../../component/Loader/LoadingSpinner";

function resetPassword() {
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
            message.success(data.message, 3);
            resetForm.resetFields();
            router.replace("/auth/login");
          }
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }
  return (
    <Layout>
      {/* {loading ? (
        <LoadingSpinner />
      ) : ( */}
      <section className="my-5">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0"></div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-10 md:mt-10">
              <h1 className="text-lg font-bold text-center mt-2 pt-1 mb-8">
                Reset Password
              </h1>
              <Form
                form={resetForm}
                layout="vertical"
                autoComplete="off"
                onFinish={handleSubmit}
              >
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
                      placeholder="New Password"
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
                    Submit
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </section>
      {/* )} */}
    </Layout>
  );
}

export default resetPassword;
