import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Select } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { URLS } from "../../constants/urls";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
import { CustomInput, CustomTextArea } from "../common/CustomFormFeilds";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import {
  getGoalFrequency,
  INDIVIDUAL_TYPE,
  ONTRACK_STATUS,
  ORGANIZATION_TYPE,
  SELF_TYPE,
  TEAM_TYPE,
} from "./constants";

function AddEditGoalComponent({ user, editMode = false }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loadingSubmitSpin, setLoadingSubmitSpin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState(false);
  const [memberList, setMemberList] = useState(false);
  const [userList, setUserList] = useState([]);
  const [teamListBox, setTeamListBox] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [assigneeList, setAssigneeList] = useState([]);

  const onFinish = (values) => {
    if (values.goal_type === TEAM_TYPE && teamList.length > 0) {
      let teamMembers = [];
      if (editMode && assigneeList.length > 0) {
        teamMembers = assigneeList.map((member) => {
          return member.assignee_id;
        });
      } else {
        teamMembers = teamList
          .find((item) => item.id === values.goal_assignee)
          .UserTeamsGroups.map((member) => {
            return member.member_id;
          });
      }
      values.goal_assignee = teamMembers;
    }
    let data = {
      goals_headers: values.goals_headers,
      goal_type: values.goal_type,
      status: ONTRACK_STATUS,
      progress: 0,
      frequency: getGoalFrequency(values.end_date),
      end_date: values.end_date,
      goal_assignee:
        values?.goal_assignee && values.goal_assignee.length > 0
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

  const redirectToGoalsPage = () => router.push(URLS.GOAL);

  const addGoalsData = async (data) => {
    setLoadingSubmitSpin(true);

    await httpService
      .post("/api/goals", data)
      .then(({ data: response }) => {
        openNotificationBox("success", response.message, 3);
        redirectToGoalsPage();
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
          openNotificationBox("success", response.message, 3);
          redirectToGoalsPage();
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
          setFormFeilds(response.data);
          setGoalData(true);
        })
        .catch(() => setGoalData(false))
        .finally(() => setLoading(false));
    }
  };

  const setFormFeilds = (data) => {
    form.setFieldsValue({
      goals_headers: [
        {
          goal_title: data?.goal_title,
          goal_description: data?.goal_description,
        },
      ],
      goal_type: data?.goal_type,
      end_date: moment(data?.end_date).format(DEFAULT_DATE_FORMAT),
    });
    setAssigneeList(data?.GoalAssignee?.length > 0 ? data.GoalAssignee : []);
  };

  useEffect(() => {
    fetchUserData();
    fetchTeamData();
    if (editMode) {
      fetchGoalData();
    } else {
      setGoalData(true);
    }
  }, []);

  const filterUserList = useMemo(() => {
    if (editMode && assigneeList.length > 0) {
      return userList?.filter((item) => {
        if (assigneeList.length > 0) {
          return assigneeList.find(
            (assignee) => assignee.assignee_id === item.user_id
          );
        }
        return null;
      });
    } else {
      return userList;
    }
  }, [assigneeList.length, userList.length, editMode]);

  useEffect(() => {
    if (editMode && filterUserList.length > 0) {
      setMemberList(true);
      form.setFieldsValue({
        goal_assignee: filterUserList.map((user) => user.user_id),
      });
    }
  }, [filterUserList.length, editMode]);

  const handleGoalType = (val) => {
    if (val === INDIVIDUAL_TYPE) {
      setMemberList(true);
      setTeamListBox(false);
    } else if (val === TEAM_TYPE) {
      setTeamListBox(true);
      setMemberList(false);
    } else {
      setMemberList(false);
      setTeamListBox(false);
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
        let filterData = response.data.filter(
          (item) => item.user.status && item.user_id != user.id
        );
        setUserList(filterData);
      })
      .catch(() => {
        setUserList([]);
      });
  }

  async function fetchTeamData() {
    setTeamList([]);
    await httpService
      .get(`/api/teams`)
      .then(({ data: response }) => {
        setTeamList(response.data);
      })
      .catch((err) => {
        setTeamList([]);
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

  if (loading)
    return (
      <div className="container mx-auto max-w-full">
        <PulseLoader />
      </div>
    );

  if (!goalData) return <NoRecordFound title="No Goal Found" />;
  return (
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
                  <ButtonGray
                    onClick={() => add()}
                    className="text-xs"
                    title={
                      <p className="mb-0 flex items-center gap-2 font-semibold">
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
            memberList || teamListBox ? "3" : "2"
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
                <Select.Option value={ORGANIZATION_TYPE}>
                  Organization
                </Select.Option>
              )}

              {user.role_id <= 3 && (
                <>
                  <Select.Option value={INDIVIDUAL_TYPE}>
                    Individual
                  </Select.Option>
                  <Select.Option value={TEAM_TYPE}>Team</Select.Option>
                </>
              )}
              <Select.Option value={SELF_TYPE}>Self</Select.Option>
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
                {filterUserList.length > 0 && (
                  <>
                    <Select.Option key="all" value="all">
                      ---SELECT ALL---
                    </Select.Option>
                    {filterUserList.map((data, index) => (
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

          {teamListBox && (
            <Form.Item
              name="goal_assignee"
              label="Team"
              rules={[
                {
                  required: true,
                  message: "Please select your Team",
                },
              ]}
            >
              <Select
                placeholder="Select Team"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                className="w-full"
                maxTagCount="responsive"
                disabled={editMode}
              >
                {teamList.length > 0 &&
                  teamList.map((data, index) => (
                    <Select.Option key={index + "teams"} value={data?.id}>
                      {data?.team_name}
                    </Select.Option>
                  ))}
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
