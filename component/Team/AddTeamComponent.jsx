import { Col, Form, Input, Row, Select } from "antd";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";

function AddTeamComponent({ user, editMode }) {
  const router = useRouter();
  const [form] = Form.useForm();

  async function onFinish(values) {
    let obj = {
      ...values,
      organization_id: user.organization_id,
    };

    editMode ? updatingMember(obj) : addingMember(obj);
  }
  async function addingMember(obj) {
    (obj.status = 0),
      await fetch("/api/team/members", {
        method: "POST",
        body: JSON.stringify(obj),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            form.resetFields();
            // setIsModalVisible(false);
            // fetchMembersData();

            openNotificationBox("success", response.message, 3);
            router.push("/team/members");
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
  }
  async function updatingMember(obj) {
    if (upadteData.id) {
      (obj.tag_id = upadteData?.UserTags?.id), 0;
      (obj.status = 1),
        await fetch("/api/team/members", {
          method: "PUT",
          body: JSON.stringify(obj),
          // headers: {
          //   "Content-Type": "application/json",
          // },
        })
          .then((response) => response.json())
          .then((response) => {
            if (response.status === 200) {
              fetchMembersData();
              form.resetFields();
              //   setIsModalVisible(false);
              setEditMode(false);
              openNotificationBox("success", response.message, 3);
            } else {
              openNotificationBox("error", response.message, 3);
            }
          })
          .catch((err) => console.log(err));
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
  const onUpdate = (data) => {
    setEditMode(true);
    setUpdateData(data);
    setIsModalVisible(true);

    form.setFieldsValue({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      tags: data.UserTags.tags,
      status: data.status,
      role: data.role_id,
    });
  };

  return (
    <div>
      <div className="w-full  md:w-3/6 mx-auto">
        <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4 add-review-from">
          <div className="  rounded-t-md  mt-1">
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
                    label="First Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24} lg={12}>
                  <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
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
                    <Input
                    //   disabled={editMode}
                    />
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
                      mode="tags"
                      placeholder="Tags"
                      className="select-tag"
                    >
                      <Select.Option key={"developer"} value={"Developer"}>
                        Developer
                      </Select.Option>
                      <Select.Option key={"QA"} value={"QA"}>
                        QA
                      </Select.Option>
                      <Select.Option key={"Testing"} value={"Testing"}>
                        Testing
                      </Select.Option>
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
                    <Select placeholder="Roles" className="select-tag">
                      <Select.Option key={"mamanger"} value={3}>
                        Manager
                      </Select.Option>
                      <Select.Option key={"member"} value={4}>
                        Member
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={24} xs={24}>
                  <div className="flex justify-end  ">
                    <Link href="/team/members">
                      <button
                        key="cancel"
                        type="default"
                        className="toggle-btn-bg text-white text-sm py-3 px-4  lg:mx-4 rounded h-full w-1/4 my-1"
                      >
                        Cancel
                      </button>
                    </Link>

                    <button
                      key="add"
                      type="submit"
                      className=" px-4 py-3 h-full rounded  text-sm primary-bg-btn text-white w-1/4 my-1"
                    >
                      Add
                    </button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeamComponent;
