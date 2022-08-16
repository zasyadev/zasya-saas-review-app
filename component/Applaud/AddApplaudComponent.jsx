import { Col, Form, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../helpers/notification";
import { PrimaryButton, SecondaryButton } from "../../helpers/CustomButton";

function AddApplaud({ user }) {
  const router = useRouter();
  const [applaudform] = Form.useForm();
  const [membersList, setMembersList] = useState([]);
  const [updateData, setUpdateData] = useState({});

  const validateMessages = {
    required: "${label} is required!",
  };

  async function fetchMember(user) {
    await fetch("/api/team/" + user.id, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 200) {
          let data = res.data.filter((item) => item.user_id != user.id);
          setMembersList(data);
        }
      })
      .catch((err) => {
        console.log(err);
        setMembersList([]);
      });
  }

  const onFinish = (values) => {
    let obj = {
      user_id: values.user_id,
      comment: values.comment,
      created_by: user.id,
    };

    addApplaud(obj);
  };

  async function addApplaud(obj) {
    await fetch("/api/applaud", {
      method: "POST",
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/applaud");
        } else {
          openNotificationBox("error", response.message, 3);
        }
      })
      .catch((err) => console.log(err));
  }

  // async function updateApplaud(obj) {
  //   if (updateData.id) {
  //     obj.id = updateData.id;
  //   }
  //   await fetch("/api/applaud", {
  //     method: "PUT",
  //     body: JSON.stringify(obj),
  //   })
  //     .then((response) => response.json())
  //     .then((response) => {
  //       if (response.status === 200) {
  //         applaudform.resetFields();
  //         // fetchApplaud();
  //         setIsModalVisible(false);
  //         setEditMode(false);
  //         openNotificationBox("success", response.message, 3);
  //       } else {
  //         openNotificationBox("error", response.message, 3);
  //       }
  //     })
  //     .catch((err) => fetchApplaud([]));
  // }

  useEffect(() => {
    if (user) fetchMember(user);
  }, []);

  return (
    <div>
      <div className="w-full  md:w-3/6 mx-auto">
        <div className="w-full bg-white rounded-xl shadow-md p-4 mt-4 add-template-wrapper">
          <div className="  rounded-t-md  mt-1">
            <Form
              layout="vertical"
              form={applaudform}
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
              <Row gutter={16}>
                <Col md={24} xs={24}>
                  <Form.Item
                    name="user_id"
                    label="Member Name"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      size="large"
                      placeholder="Select Member"
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {membersList.map((data, index) => (
                        <Select.Option key={index} value={data.user_id}>
                          {data?.user?.first_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col md={24} xs={24}>
                  <Form.Item
                    name="comment"
                    label="Comment"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <TextArea />
                  </Form.Item>
                </Col>

                <Col md={24} xs={24}>
                  <div className="flex justify-end  ">
                    <SecondaryButton
                      withLink={true}
                      linkHref="/applaud"
                      className="mr-2 lg:mx-4 rounded my-1"
                      title="Cancel"
                    />
                    <PrimaryButton
                      className="  my-1 rounded"
                      title="Create"
                      btnProps={{ htmlType: "submit" }}
                    />
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </div>{" "}
    </div>
  );
}
export default AddApplaud;
