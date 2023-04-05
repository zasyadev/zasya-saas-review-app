import { Col, Form, Row, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  PrimaryButton,
  SecondaryButton,
} from "../../component/common/CustomButton";
import { openNotificationBox } from "../../component/common/notification";
import { ApplaudCategoryList } from "../../constants/applaudCategoryList";

import httpService from "../../lib/httpService";
import { CustomTextArea } from "../common/CustomFormFeilds";
import CustomPopover from "../common/CustomPopover";

function AddApplaud({ user }) {
  const router = useRouter();
  const [applaudform] = Form.useForm();
  const [membersList, setMembersList] = useState([]);
  const [applaudLimit, setApplaudLimit] = useState(0);
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);

  const validateMessages = {
    required: "${label} is required!",
  };

  async function fetchMember() {
    await httpService
      .get(`/api/member/${user.id}`)
      .then(({ data }) => {
        let filterData = data.data.filter(
          (item) => item.user_id != user.id && item.user.status
        );
        setMembersList(filterData);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setMembersList([]);
      });
  }

  async function fetchApplaudLimit() {
    await httpService
      .get(`/api/applaud/applaudlimit`)
      .then(({ data }) => {
        setApplaudLimit(data);
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
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
        openNotificationBox("success", response.message, 3);
        router.push("/applaud");
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  }

  useEffect(() => {
    fetchMember();
    fetchApplaudLimit();
  }, []);

  return (
    <div className="w-full  md:w-3/6 mx-auto">
      <div className="w-full bg-white rounded-md shadow-md p-5 mt-4 add-template-wrapper">
        <div className=" rounded-t-md  mt-1">
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
                      Category
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
                  <CustomTextArea rows={2} customclassname="shadow-none" />
                </Form.Item>
              </Col>

              <Col md={24} xs={24}>
                <div className="flex justify-end shad  ">
                  <SecondaryButton
                    withLink={true}
                    linkHref="/applaud"
                    className="mr-2 lg:mx-4 rounded my-1"
                    title="Cancel"
                  />
                  <PrimaryButton
                    className="  my-1 rounded"
                    title={`Create`}
                    loading={loadingSubmitSpin}
                    type="submit"
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
export default AddApplaud;
