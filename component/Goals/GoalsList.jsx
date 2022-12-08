import { EllipsisOutlined, EditOutlined } from "@ant-design/icons";
import { Dropdown, Form, Input, Menu, Select, Skeleton } from "antd";
import moment from "moment/moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import {
  ButtonGray,
  PrimaryButton,
  SecondaryButton,
} from "../common/CustomButton";
import CustomModal from "../common/CustomModal";
import CustomTable from "../common/CustomTable";

const initialModalVisible = {
  visible: false,
  id: "",
  goal_title: "",
  defaultValue: "",
};

function GoalsList({ user }) {
  const [updateGoalForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [editGoalModalVisible, setEditGoalModalVisible] =
    useState(initialModalVisible);
  const [goalsList, setGoalsList] = useState([]);

  async function fetchGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }
  async function fetchGoalList() {
    setLoading(true);
    setGoalsList([]);

    await httpService
      .get(`/api/goals`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setGoalsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  }

  useEffect(() => {
    fetchGoalList();
  }, []);

  const goalEditHandle = async (id, value, type) => {
    await httpService
      .put(`/api/goals/${id}`, {
        value,
        type,
      })
      .then(({ data: response }) => {
        if (response.status === 200) {
          fetchGoalList();
          setEditGoalModalVisible(initialModalVisible);
        }
      })
      .catch((err) => {
        console.error(err.response.data?.message);
      });
  };

  const columns = [
    {
      title: "Goal Name",
      key: "goal_title",
      render: (_, record) => (
        <Link href={`/goals/${record.id}/detail`} passHref>
          <p className="cursor-pointer underline text-gray-500 mb-0">
            {record.goal_title}
          </p>
        </Link>
      ),
    },
    {
      title: "Type",
      key: "goal_type",
      dataIndex: "goal_type",
    },
    {
      title: "Status",
      key: "status",

      render: (_, record) => (
        <p className="cursor-pointer text-gray-500 mb-0 ">
          {record.status}
          {!record.is_archived && (
            <span className="ml-2">
              <EditOutlined
                onClick={() => {
                  setEditGoalModalVisible({
                    visible: true,
                    id: record.id,
                    goal_title: record.goal_title,
                    defaultValue: record.status,
                  });
                  updateGoalForm.resetFields();
                }}
              />
            </span>
          )}
        </p>
      ),
    },
    {
      title: "End Date",
      key: "end_date",
      render: (_, record) =>
        moment(record?.end_date).format(DEFAULT_DATE_FORMAT),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.created_by === user.id && (
          <Dropdown
            trigger={"click"}
            overlay={
              <Menu className="divide-y">
                <Menu.Item className="font-semibold" key={"call-preview"}>
                  <Link href={`/goals/${record.id}/edit`}>Edit</Link>
                </Menu.Item>

                <Menu.Item
                  className="text-red-600 font-semibold"
                  key={"call-delete"}
                  onClick={() =>
                    goalEditHandle(
                      record.id,
                      record.is_archived ? false : true,
                      "forArchived"
                    )
                  }
                >
                  {record.is_archived ? "UnArchived" : "Archived"}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <ButtonGray
              className="grid place-content-center w-8 h-8"
              rounded="rounded-full"
              title={
                <EllipsisOutlined rotate={90} className="text-lg leading-0" />
              }
            />
          </Dropdown>
        ),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="grid grid-cols-1 mb-16">
        <div className="flex flex-row items-center justify-end flex-wrap gap-4  mb-4 md:mb-6 ">
          <PrimaryButton
            withLink={true}
            linkHref={`/goals/add`}
            title={"Create"}
          />
        </div>
        <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
          {loading ? (
            <div className="p-4">
              <Skeleton title={false} active={true} />
            </div>
          ) : (
            <CustomTable dataSource={goalsList} columns={columns} />
          )}
        </div>
      </div>

      <CustomModal
        title={
          <p className="single-line-clamp mb-0 pr-6">
            {editGoalModalVisible.goal_title}
          </p>
        }
        visible={editGoalModalVisible.visible}
        onCancel={() => setEditGoalModalVisible(initialModalVisible)}
        customFooter
        footer={[
          <>
            <SecondaryButton
              onClick={() => setEditGoalModalVisible(initialModalVisible)}
              className=" h-full mr-2"
              title="Cancel"
              disabled={loading}
            />
            <PrimaryButton
              onClick={() => updateGoalForm.submit()}
              className=" h-full  "
              title="Update"
              disabled={loading}
              loading={loading}
            />
          </>,
        ]}
      >
        <div>
          <Form
            layout="vertical"
            form={updateGoalForm}
            onFinish={(value) =>
              goalEditHandle(editGoalModalVisible.id, value, "forStatus")
            }
            initialValues={{
              status: editGoalModalVisible.defaultValue,
            }}
          >
            <Form.Item name="status" label="Status">
              <Select value={editGoalModalVisible.defaultValue}>
                <Select.Option value="OnTrack">On Track</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
                <Select.Option value="Delayed">Delayed</Select.Option>
                <Select.Option value="Abandoned">Abandoned</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="comment" label="Comment">
              <Input />
            </Form.Item>
          </Form>
        </div>
      </CustomModal>
    </div>
  );
}

export default GoalsList;
