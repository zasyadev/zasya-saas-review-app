import { Col, Form, Input, Row, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";

function AddTeamComponent({ user, editMode, memberData }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [tagsList, setTagsList] = useState([]);

  async function onFinish(values) {
    let obj = {
      ...values,
      created_by: user.id,
    };

    editMode ? updatingMember(obj) : addingMember(obj);
  }
  async function addingMember(obj) {
    (obj.status = 0),
      await httpService
        .post(`/api/team/members`, obj)
        .then(({ data: response }) => {
          if (response.status === 200) {
            form.resetFields();
            openNotificationBox("success", response.message, 3);
            router.push("/team/members");
          }
        })
        .catch((err) => {
          console.error(err.response.data.message);
          openNotificationBox("error", err.response.data.message, 3);
        });
  }
  async function updatingMember(obj) {
    if (memberData.id) {
      // (obj.tag_id = memberData?.UserTags?.id), 0;
      (obj.status = 1),
        await httpService
          .put(`/api/team/members`, obj)
          .then(({ data: response }) => {
            if (response.status === 200) {
              form.resetFields();

              openNotificationBox("success", response.message, 3);
              router.push("/team/members");
            } else {
              openNotificationBox("error", response.message, 3);
            }
          })
          .catch((err) => {
            console.error(err.response.data.message);
            openNotificationBox("error", err.response.data.message);
          });
    }
  }

  async function fetchTagsData() {
    if (user.id) {
      await httpService
        .get(`/api/team/tags/${user.id}`)
        .then(({ data: response }) => {
          if (response.status === 200) {
            setTagsList(response.data);
          }
        })
        .catch((err) => {
          console.error(err.response.data.message);
          setTagsList([]);
        });
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
      <div className="w-full bg-white rounded-md shadow-md p-4 mt-4 add-template-wrapper">
        <div className="rounded-t-md  mt-1">
          {" "}
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <Row gutter={16}>
              <Col md={12} xs={24} lg={12}>
                <Form.Item
                  name="first_name"
                  label="Name"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24} lg={12}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                    },
                    {
                      type: "email",
                    },
                  ]}
                >
                  <Input disabled={editMode} size="large" />
                </Form.Item>
              </Col>

              <Col md={12} xs={24} lg={12}>
                <Form.Item
                  name="tags"
                  label="Tags Name"
                  rules={[
                    {
                      required: true,
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
                        .map((item, idx) => {
                          return (
                            <Select.Option
                              key={idx + "tags"}
                              value={item.tag_name}
                            >
                              {item.tag_name}
                            </Select.Option>
                          );
                        })}
                  </Select>
                </Form.Item>
              </Col>

              <Col md={12} xs={24} lg={12}>
                <Form.Item
                  name="role"
                  label="Roles "
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder="Roles"
                    className="select-tag"
                    size="large"
                  >
                    {/* <Select.Option key={"amin"} value={2} disabled>
                        Admin
                      </Select.Option> */}
                    <Select.Option key={"manager"} value={3}>
                      Manager
                    </Select.Option>
                    <Select.Option key={"member"} value={4}>
                      Member
                    </Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col md={24} xs={24}>
                <div className="flex justify-end">
                  <SecondaryButton
                    withLink={true}
                    linkHref="/team/members"
                    className="mx-4 rounded my-1"
                    title="Cancel"
                  />
                  <PrimaryButton
                    btnProps={{ htmlType: "submit" }}
                    className=" my-1 rounded "
                    title={editMode ? "Update" : "Create"}
                  />
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default AddTeamComponent;
