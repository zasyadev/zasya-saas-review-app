import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";
import NoRecordFound from "../common/NoRecordFound";
import { URLS } from "../../constants/urls";

function AddUpdateTeamMember({ editMode = false, team_id }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [selectedManagerId, setSelectedManagerId] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectToTeamsPage = () => router.push(URLS.TEAMS);

  async function onFinish(values) {
    editMode ? updatingMember(values) : addingMember(values);
  }

  async function addingMember(obj) {
    await httpService
      .post(`/api/teams`, obj)
      .then(({ data: response }) => {
        if (response.status === 200) {
          form.resetFields();
          openNotificationBox("success", response.message, 3);
          redirectToTeamsPage();
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err.response.data?.message || "Failed ! Please try again"
        );
      });
  }

  async function updatingMember(obj) {
    await httpService
      .put(`/api/teams`, { id: team_id, ...obj })
      .then(({ data: response }) => {
        if (response.status === 200) {
          form.resetFields();
          openNotificationBox("success", response.message, 3);
          redirectToTeamsPage();
        }
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err.response.data?.message || "Failed ! Please try again"
        );
      });
  }

  async function fetchTeamData(id) {
    await httpService
      .get(`/api/teams/${id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          if (Number(response.data?.UserTeamsGroups?.length) > 0) {
            const memberList = response.data?.UserTeamsGroups.filter(
              (group) => !group.isManager
            ).map((group) => group.member_id);

            const managerId = response.data?.UserTeamsGroups.find(
              (group) => group.isManager
            )?.member_id;

            if (memberList && managerId) {
              setSelectedManagerId(managerId);
              form.setFieldsValue({
                name: response.data?.team_name,
                manager: managerId,
                members: memberList,
              });
            }
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        openNotificationBox(
          "error",
          err.response.data?.message || "Failed ! Please try again"
        );
      });
  }

  const fetchUserData = useCallback(async () => {
    await httpService
      .get(`/api/user/organizationId`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let filterData = response.data.filter(
            (item) => item.user.status && item.role_id !== 2
          );
          setUserList(filterData);
        }
      })
      .catch((err) => {
        setUserList([]);
        openNotificationBox(
          "error",
          err.response.data?.message || "Failed ! Please try again"
        );
      });
  }, []);

  useEffect(() => {
    fetchUserData();
    if (editMode && team_id) {
      setLoading(true);
      fetchTeamData(team_id);
    }
  }, []);

  const filteredUserList = useMemo(() => {
    return userList.filter((item) => item.user_id !== selectedManagerId);
  }, [selectedManagerId, userList]);

  return loading ? (
    <PulseLoader />
  ) : !selectedManagerId && editMode ? (
    <NoRecordFound title={"No Team Found"} />
  ) : (
    <div className="w-full  md:w-3/6 mx-auto">
      <div className="w-full bg-white rounded-md shadow-md p-5 mt-4 add-template-wrapper">
        <div className="rounded-t-md  mt-1">
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item
              name="name"
              label="Name"
              rules={[
                {
                  required: true,
                  message: "Required!",
                },
                { validator: (_, value) => maxLengthValidator(value, 100) },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="manager"
              label="Manager "
              rules={[
                {
                  required: true,
                  message: "Please select your Manager",
                },
              ]}
            >
              <Select
                placeholder="Select Manager"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onSelect={(value) => {
                  setSelectedManagerId(value);
                }}
                size="large"
                className="w-full"
                maxTagCount="responsive"
              >
                {userList.length > 0 &&
                  userList.map((data, index) => (
                    <Select.Option key={index + "users"} value={data?.user?.id}>
                      {data?.user?.first_name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            {selectedManagerId && (
              <Form.Item
                name="members"
                label="Members "
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  size="large"
                  className="w-full"
                  maxTagCount="responsive"
                >
                  {filteredUserList?.length > 0 &&
                    filteredUserList?.map((data, index) => (
                      <Select.Option
                        key={index + "users"}
                        value={data?.user?.id}
                      >
                        {data?.user?.first_name}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}

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

export default AddUpdateTeamMember;
