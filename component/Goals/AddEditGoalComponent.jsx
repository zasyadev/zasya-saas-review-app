import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import { getGoalFrequency } from "./constants";

function AddEditGoalComponent({ user, editMode = false }) {
  const router = useRouter();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberList, setMemberList] = useState(false);
  const [userList, setUserList] = useState([]);

  const [form] = Form.useForm();

  const onFinish = (values) => {
    let data = {
      goals_headers: values.goals_headers,
      goal_type: values.goal_type,
      status: "OnTrack",
      progress: 0,
      frequency: getGoalFrequency(values.end_date),
      end_date: values.end_date,
      goal_assignee:
        values?.goal_assignee && Number(values?.goal_assignee?.length) > 0
          ? values?.goal_assignee
          : [],
    };

    editMode
      ? updateGoalData({
          ...data,
          id: router.query.goal_id,
        })
      : addGoalsData(data);
  };

  const addGoalsData = async (data) => {
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/goals", data)
      .then(({ data: response }) => {
        if (response.status === 200) {
          openNotificationBox("success", response.message, 3);
          router.push("/goals");
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
        setLoadingSubmitSpin(false);
      });
  };
  const updateGoalData = async (data) => {
    if (data.id) {
      setLoadingSubmitSpin(true);

      await httpService
        .put("/api/goals", data)
        .then(({ data: response }) => {
          if (response.status === 200) {
            openNotificationBox("success", response.message, 3);
            router.push("/goals");
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
          setLoadingSubmitSpin(false);
        });
    }
  };

  const fetchGoalData = async () => {
    if (router.query.goal_id) {
      setLoading(true);
      await httpService
        .get(`/api/goals/${router.query.goal_id}`)
        .then(({ data: response }) => {
          if (response.status === 200) {
            form.setFieldsValue({
              goals_headers: [
                {
                  goal_title: response.data.goal_title,
                  goal_description: response.data.goal_description,
                },
              ],
              goal_type: response.data.goal_type,
              end_date: moment(response.data.end_date).format(
                DEFAULT_DATE_FORMAT
              ),
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (editMode) {
      fetchGoalData();
    }
    fetchUserData();
  }, [editMode]);

  const handleGoalType = (val) => {
    if (val === "Individual") {
      setMemberList(true);
    } else {
      setMemberList(false);
      form.setFieldsValue({
        goal_assignee: [],
      });
    }
  };

  async function fetchUserData() {
    setUserList([]);
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.user_id != user.id
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
        console.error(err.response.data?.message);
      });
  }

  const onMemberInputChange = (value) => {
    if (value && userList.length > 0) {
      if (value.includes("all")) {
        let allUsers = userList.map((item) => {
          return item.user.id;
        });
        form.setFieldsValue({
          goal_assignee: allUsers,
        });
      }
    }
  };

  return loading ? (
    <div className="container mx-auto max-w-full">
      <PulseLoader />
    </div>
  ) : (
    <Form
      form={form}
      name="goals"
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        goals_headers: [
          {
            goal_title: "",
            goal_description: "",
          },
        ],
      }}
    >
      <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2 md:px-8">
        <Form.List name="goals_headers">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div key={index + "form"}>
                  <Form.Item
                    label={`Title ${fields.length > 1 ? index + 1 : ""}`}
                    {...restField}
                    name={[name, "goal_title"]}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                      {
                        validator: (_, value) => maxLengthValidator(value, 120),
                      },
                    ]}
                  >
                    <CustomInput
                      placeholder="Goal Title eg:weekly targets"
                      className=" h-12 rounded-md"
                    />
                  </Form.Item>
                  <Form.Item
                    label={`Description ${fields.length > 1 ? index + 1 : ""}`}
                    {...restField}
                    name={[name, "goal_description"]}
                    rules={[
                      {
                        required: true,
                        message: "Required!",
                      },
                      {
                        validator: (_, value) => maxLengthValidator(value, 400),
                      },
                    ]}
                  >
                    <CustomTextArea
                      placeholder="Type here ...."
                      className=" min-h-8 rounded-md"
                    />
                  </Form.Item>
                  {key != 0 && (
                    <div onClick={() => remove(name)} className="flex mb-3">
                      <span className="px-4 py-2 border hover:bg-red-100 border-red-100 flex items-center gap-2 cursor-pointer rounded-md">
                        <MinusCircleOutlined /> Remove
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {fields.length < 5 && !editMode && (
                <div className="text-right">
                  <PrimaryButton
                    onClick={() => add()}
                    className="mr-2 lg:mx-4 my-1"
                    title={
                      <p className="mb-0 flex items-center gap-2">
                        <PlusOutlined /> Add More
                      </p>
                    }
                    type="button"
                  />
                </div>
              )}
            </>
          )}
        </Form.List>
      </div>
      <div className="w-full bg-white rounded-md  shadow-md p-5 mt-2 md:px-8">
        <div
          className={`grid grid-cols-1 md:grid-cols-${
            memberList ? "3" : "2"
          } gap-4`}
        >
          <Form.Item
            label="Goal Type"
            name="goal_type"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Select
              placeholder="Select Goal Type"
              size="large"
              onSelect={(val) => handleGoalType(val)}
              disabled={editMode}
            >
              {user.role_id === 2 && (
                <Select.Option value="Organization">Organization</Select.Option>
              )}
              {/* <Select.Option value="Team">Team</Select.Option> */}
              {(user.role_id === 2 || user.role_id === 3) && (
                <Select.Option value="Individual">Individual</Select.Option>
              )}
              <Select.Option value="Self">Self</Select.Option>
            </Select>
          </Form.Item>

          {memberList && (
            <Form.Item
              name="goal_assignee"
              label="Member "
              rules={[
                {
                  required: true,
                  message: "Please select your Members",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select Member"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(e) => onMemberInputChange(e)}
                size="large"
                className="w-full"
                maxTagCount="responsive"
                disabled={editMode}
              >
                {userList.length > 0 && (
                  <>
                    <Select.Option key="all" value="all">
                      ---SELECT ALL---
                    </Select.Option>
                    {userList.map((data, index) => (
                      <Select.Option
                        key={index + "users"}
                        value={data?.user?.id}
                      >
                        {data?.user?.first_name}
                      </Select.Option>
                    ))}
                  </>
                )}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            label="Time"
            name="end_date"
            rules={[
              {
                required: true,
                message: "Required!",
              },
            ]}
          >
            <Select
              placeholder="Select Goal Scope"
              size="large"
              disabled={editMode}
            >
              <Select.Option value={0}>Day</Select.Option>
              <Select.Option value={1}>Week</Select.Option>
              <Select.Option value={2}> Month</Select.Option>
              <Select.Option value={3}>Six Month</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div className="flex justify-end">
          <PrimaryButton
            className="my-1 rounded"
            title={`${editMode ? "Update" : "Create"}`}
            type="submit"
            loading={loadingSubmitSpin}
          />
        </div>
      </div>
    </Form>
  );
}

export default AddEditGoalComponent;
