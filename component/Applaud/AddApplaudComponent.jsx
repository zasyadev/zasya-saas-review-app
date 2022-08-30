import { Col, Form, Row, Select, Tooltip } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../component/common/notification";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import httpService from "../../lib/httpService";

function AddApplaud({ user }) {
  const router = useRouter();
  const [applaudform] = Form.useForm();
  const [membersList, setMembersList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [applaudLimit, setApplaudLimit] = useState(0);

  const validateMessages = {
    required: "${label} is required!",
  };

  async function fetchMember(user) {
    await httpService
      .get(`/api/team/${user.id}`)
      .then(({ data }) => {
        if (data.status === 200) {
          let filterData = data.data.filter((item) => item.user_id != user.id);
          setMembersList(filterData);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        openNotificationBox("error", err.response.data.message);
        setMembersList([]);
      });
  }

  async function fetchApplaudLimit(user) {
    await httpService
      .post(`/api/applaud/applaudlimit`, {
        userId: user.id,
      })
      .then(({ data }) => {
        if (data.status === 200) {
          setApplaudLimit(data);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);

        setApplaudLimit(0);
      });
  }
  async function fetchCategoryList() {
    await httpService
      .get(`/api/applaud/category`)
      .then(({ data }) => {
        if (data.status === 200) {
          setCategoryList(data.data);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        setCategoryList(0);
      });
  }

  const onFinish = (values) => {
    if (!applaudLimit > 0) {
      openNotificationBox("error", "Max Limit has been reached to add applaud");
    } else {
      let obj = {
        user_id: values.user_id,
        comment: values.comment,
        created_by: user.id,
        category: values.category,
      };

      addApplaud(obj);
    }
  };

  async function addApplaud(obj) {
    await httpService
      .post("/api/applaud", obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/applaud");
        }
      })
      .catch((err) => {
        console.error(err);
        openNotificationBox("error", err.response.data.message);
      });
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
    fetchMember(user);
    fetchApplaudLimit(user);
    fetchCategoryList();
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
                    name="category"
                    label="Category"
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
                      {categoryList.length > 0 &&
                        categoryList.map((item, idx) => {
                          return (
                            <Select.Option
                              key={idx + "tags"}
                              value={item.name}
                              title={item.about}
                            >
                              {item.name}
                            </Select.Option>
                          );
                        })}
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
                      btnProps={{
                        htmlType: "submit",
                      }}
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
