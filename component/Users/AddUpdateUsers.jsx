import { Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import { openNotificationBox } from "../common/notification";
import { maxLengthValidator } from "../../helpers/formValidations";
import getErrors from "../../helpers/getErrors";
import httpService from "../../lib/httpService";
import { URLS } from "../../constants/urls";

function AddUpdateUsers({ user, editMode, memberData }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [tagsList, setTagsList] = useState([]);

  const redirectToUsersPage = () => router.push(URLS.USERS);

  async function onFinish(values) {
    editMode ? updatingMember(values) : addingMember(values);
  }

  async function addingMember(obj) {
    await httpService
      .post(`/api/member`, obj)
      .then(({ data: response }) => {
        form.resetFields();
        openNotificationBox("success", response.message, 3);
        redirectToUsersPage();
      })
      .catch((err) => {
        if (
          err?.response?.status === 400 &&
          Number(err?.response?.data?.inner?.length) > 0
        ) {
          const errorNode = getErrors(err?.response?.data?.inner);

          openNotificationBox("error", "Errors", 5, "error-reg", errorNode);
        } else openNotificationBox("error", err.response.data?.message);
      });
  }

  async function updatingMember(obj) {
    if (memberData.id) {
      await httpService
        .put(`/api/member`, { id: memberData.id, ...obj })
        .then(({ data: response }) => {
          form.resetFields();
          openNotificationBox("success", response.message, 3);
          redirectToUsersPage();
        })
        .catch((err) =>
          openNotificationBox("error", err.response.data?.message)
        );
    }
  }

  async function fetchTagsData() {
    if (user.id) {
      await httpService
        .get(`/api/member/tags/${user.id}`)
        .then(({ data: response }) => setTagsList(response.data))
        .catch(() => setTagsList([]));
    }
  }

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  useEffect(() => {
    if (editMode && memberData) {
      form.setFieldsValue({
        first_name: memberData?.first_name,
        last_name: memberData?.last_name,
        email: memberData?.email,
        tags: memberData?.userOrgData?.tags,
        role: memberData?.userOrgData?.role_id,
      });
    }
    fetchTagsData();
  }, []);

  return (
    <div className="w-full  md:w-3/6 mx-auto">
      <div className="w-full bg-white rounded-md shadow-md p-5 mt-4 add-template-wrapper">
        <div className="rounded-t-md  mt-1">
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Form.Item
              name="first_name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
                { validator: (_, value) => maxLengthValidator(value, 50) },
              ]}
            >
              <Input className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none" />
            </Form.Item>

            {editMode ? (
              <Form.Item label="Email">
                <Input
                  disabled={editMode}
                  value={memberData.email}
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 disabled:opacity-60 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0  focus:outline-none"
                />
              </Form.Item>
            ) : (
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter valid email!",
                  },
                ]}
              >
                <Input
                  disabled={editMode}
                  className="form-control block w-full px-4 py-2 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-green-500 focus:outline-none"
                />
              </Form.Item>
            )}

            <Form.Item
              name="tags"
              label="Tags Name"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
              ]}
            >
              <Select
                size="large"
                mode="tags"
                placeholder="Tags"
                className="select-tag tag-select-box"
              >
                <Select.Option key={"developer"} value={"Developer"}>
                  Developer
                </Select.Option>
                {tagsList.length > 0 &&
                  tagsList
                    .filter((data) => data.tag_name != "Developer")
                    .map((item, idx) => (
                      <Select.Option key={idx + "tags"} value={item.tag_name}>
                        {item.tag_name}
                      </Select.Option>
                    ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="role"
              label="Roles "
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
              ]}
            >
              <Select placeholder="Roles" className="select-tag" size="large">
                <Select.Option key={"manager"} value={3}>
                  Manager
                </Select.Option>
                <Select.Option key={"member"} value={4}>
                  Member
                </Select.Option>
              </Select>
            </Form.Item>

            <div className="flex justify-end">
              <SecondaryButton
                withLink={true}
                linkHref={URLS.TEAMS}
                className="mx-4 my-1"
                title="Cancel"
              />
              <PrimaryButton
                type="submit"
                className=" my-1 "
                title={editMode ? "Update" : "Create"}
              />
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddUpdateUsers;
