import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import CustomTable from "../common/CustomTable";
import { openNotificationBox } from "../common/notification";
import httpService from "../../lib/httpService";
import { PrimaryButton, ButtonGray } from "../common/CustomButton";

function TeamsListComponent({ user }) {
  const [loading, setLoading] = useState(false);
  const [teamsList, setTeamsList] = useState([]);

  async function onDelete(id) {
    if (id) {
      await httpService
        .delete(`/api/teams/${id}`, {})
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchTeamsData();
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function fetchTeamsData() {
    setLoading(true);
    setTeamsList([]);
    await httpService
      .get(`/api/teams`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setTeamsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        setTeamsList([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchTeamsData();
  }, []);

  const columns = [
    {
      title: "Name",
      key: "team_name",
      dataIndex: "team_name",

      sorter: (a, b) => a.team_name?.localeCompare(b.team_name),
    },
    {
      title: "Manager Name",
      key: "manager_name",
      render: (_, record) =>
        record?.UserTeamsGroups.find((item) => item.isManager)?.member
          ?.first_name,
    },
    {
      title: "Member Count ",
      key: "member_count",
      render: (_, record) => record?.UserTeamsGroups?.length,
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        user.role_id === 2 && (
          <p>
            <Link href={`/teams/edit/${record.id}`} passHref>
              <EditOutlined className="primary-color-blue text-xl mx-1  md:mx-2 cursor-pointer" />
            </Link>

            <Popconfirm
              title={`Are you sure to delete ${record?.team_name}？`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(record.id)}
              icon={false}
            >
              <DeleteOutlined className="text-red-500 text-xl mx-1 md:mx-2 cursor-pointer" />
            </Popconfirm>
          </p>
        ),
    },
  ];
  return (
    <div className="container mx-auto max-w-full">
      <div className="mb-4 md:mb-6 flex justify-end space-x-3">
        <ButtonGray
          withLink={true}
          className="px-2 md:px-4 "
          linkHref="/users"
          title={"All Users"}
        />
        <PrimaryButton
          withLink={true}
          className="px-2 md:px-4 "
          linkHref="/teams/add"
          title={"Create"}
        />
      </div>

      <div className="w-full bg-white rounded-md overflow-hdden shadow-md">
        {loading ? (
          <div className="p-4 ">
            <Skeleton title={false} active={true} className="my-4" />
          </div>
        ) : (
          <CustomTable
            dataSource={teamsList}
            columns={columns}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
}

export default TeamsListComponent;
