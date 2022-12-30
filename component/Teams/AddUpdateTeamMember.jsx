import { Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { maxLengthValidator } from "../../helpers/formValidations";
import httpService from "../../lib/httpService";
import { PrimaryButton, SecondaryButton } from "../common/CustomButton";
import { openNotificationBox } from "../common/notification";
import { PulseLoader } from "../Loader/LoadingSpinner";

function AddUpdateTeamMember({ editMode = false, team_id }) {
  const router = useRouter();
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);
  const [isManagerSelected, setIsManagerSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isManagerStateChange, setIsManagerStateChange] = useState(false);

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
          router.push("/teams");
        }
      })
      .catch((err) => {
        openNotificationBox("error", err.response.data?.message);
      });
  }
  async function updatingMember(obj) {
    if (team_id) {
      await httpService
        .put(`/api/teams`, { id: team_id, ...obj })
        .then(({ data: response }) => {
          if (response.status === 200) {
            form.resetFields();
            openNotificationBox("success", response.message, 3);
            router.push("/teams");
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function fetchTeamData(id) {
    await httpService
      .get(`/api/teams/${id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setIsManagerSelected(true);
          const memberList =
            response.data?.UserTeamsGroups?.length > 0
              ? response.data?.UserTeamsGroups.filter(
                  (group) => !group.isManager
                ).map((group) => group.member_id)
              : [];
          const manager =
            response.data?.UserTeamsGroups?.length > 0
              ? response.data?.UserTeamsGroups.find((group) => group.isManager)
                  .member_id
              : "";
          if (memberList && manager) {
            form.setFieldsValue({
              name: response.data?.team_name,
              manager: manager,
              members: memberList,
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  async function fetchUserData() {
    setUserList([]);
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
      });
  }

  useEffect(() => {
    if (editMode && team_id) {
      setLoading(true);
      fetchTeamData(team_id);
    }
    fetchUserData();
  }, []);

  const managerUser = useMemo(
    () => form.getFieldValue("manager"),
    [isManagerStateChange]
  );

  const filteredUserList = useMemo(() => {
    form.setFieldValue("members", []);
    {
      return userList.filter((item) => item.user_id !== managerUser);
    }
  }, [isManagerStateChange]);

  return loading ? (
    <PulseLoader />
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
                placeholder="Select Member"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                onChange={(e) => {
                  setIsManagerSelected(true);
                  setIsManagerStateChange((prev) => !prev);
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
            {isManagerSelected && (
              <Form.Item
                name="members"
                label="Members "
                rules={[
                  {
                    required: true,
                    message: "Please select your Manager",
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
                linkHref="/teams"
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
