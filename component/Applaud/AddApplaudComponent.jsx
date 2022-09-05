import { Col, Form, Row, Select, Spin } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { openNotificationBox } from "../../component/common/notification";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import httpService from "../../lib/httpService";
import CustomPopover from "../common/CustomPopover";
import { ApplaudCategoryList } from "../../constants";
import { LoadingOutlined } from "@ant-design/icons";

function AddApplaud({ user }) {
  const router = useRouter();
  const [applaudform] = Form.useForm();
  const [membersList, setMembersList] = useState([]);
  const [applaudLimit, setApplaudLimit] = useState(0);
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);

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
        openNotificationBox("error", err.response.data.message);
        setApplaudLimit(0);
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
    setLoadingSubmitSpin(true);
    await httpService
      .post("/api/applaud", obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/applaud");
        }
        setLoadingSubmitSpin(false);
      })
      .catch((err) => {
        console.error(err);
        openNotificationBox("error", err.response.data.message);
        setLoadingSubmitSpin(false);
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
  }, []);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
        color: "white",
      }}
      spin
    />
  );

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
                    label={
                      <p className="flex items-center">
                        Category{" "}
                        <span className="leading-[0] ml-2">
                          {CustomPopover(
                            "Category that can  define your applaud. Hover over them to see details"
                          )}
                        </span>
                      </p>
                    }
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Category"
                      className="select-tag tag-select-box "
                    >
                      {ApplaudCategoryList.length &&
                        ApplaudCategoryList.map((item, idx) => {
                          return (
                            <Select.OptGroup
                              label={item.name}
                              key={idx + "group"}
                            >
                              {item.data.map((dataItem, i) => {
                                return (
                                  <Select.Option
                                    key={i + dataItem.value}
                                    value={dataItem.value}
                                    title={dataItem.about}
                                    className="font-medium"
                                  >
                                    <span title={dataItem.about}>
                                      {dataItem.name}
                                    </span>
                                  </Select.Option>
                                );
                              })}
                            </Select.OptGroup>
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
                      title={
                        loadingSubmitSpin ? (
                          <Spin indicator={antIcon} />
                        ) : (
                          `Create`
                        )
                      }
                      btnProps={{
                        htmlType: "submit",
                        disabled: loadingSubmitSpin,
                      }}
                    />
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
export default AddApplaud;
