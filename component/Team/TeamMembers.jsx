import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PrimaryButton } from "../../component/common/CustomButton";
import CustomTable from "../../component/common/CustomTable";
import { openNotificationBox } from "../../component/common/notification";
import httpService from "../../lib/httpService";

function TeamMembers({ user }) {
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);

  async function onDelete(email) {
    if (email) {
      await httpService
        .delete(`/api/team/members`, {
          data: {
            email: email,
            created_by: user.id,
          },
        })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchMembersData();
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          console.error(err.response.data?.message);
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function fetchMembersData() {
    setLoading(true);
    setMembersList([]);
    await httpService
      .get(`/api/team/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.user_id != user.id);

          setMembersList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data?.message);
        setMembersList([]);
        setLoading(false);
      });
  }

  useEffect(() => {
    fetchMembersData();
  }, []);

  const columns = [
    {
      title: "Name",
      key: "id",
      render: (_, record) =>
        record?.user.first_name + " " + record?.user?.last_name,
      sorter: (a, b) => a.user.first_name?.localeCompare(b.user.first_name),
    },
    {
      title: "Email",
      render: (_, record) => record?.user.email,
      sorter: (a, b) => a.user.email?.localeCompare(b.user.email),
    },
    {
      title: "Tags",
      render: (_, record) => (
        <div className="grid grid-cols-1  lg:grid-cols-3 gap-2 w-40 lg:w-full">
          {record?.tags?.length > 0 &&
            record?.tags.map((item, index) => (
              <span
                className="text-sm text-center bg-sky-300  text-white rounded px-2 py-1"
                key={index + "tags"}
              >
                {item}
              </span>
            ))}
        </div>
      ),
    },
    {
      title: "Status",
      render: (_, record) => (
        <span
          className={`text-sm text-center ${
            record?.user?.status === 0 ? "text-red-700" : "text-green-700"
          } rounded font-semibold text-center`}
        >
          {record?.user?.status === 0 ? "Inactive" : "Active"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        record.role_id === 2 ? null : (
          <p>
            <Link href={`/team/edit/${record.user_id}`} passHref>
              <EditOutlined className="primary-color-blue text-xl mx-1  md:mx-2 cursor-pointer" />
            </Link>

            <Popconfirm
              title={`Are you sure to delete ${
                record?.user?.first_name + " " + record?.user?.last_name
              }？`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => onDelete(record.user.email)}
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
      <div className="mb-4 md:mb-6 flex justify-end">
        <PrimaryButton
          withLink={true}
          className="px-2 md:px-4 "
          linkHref="/team/add"
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
            dataSource={membersList}
            columns={columns}
            className="custom-table"
          />
        )}
      </div>
    </div>
  );
}

export default TeamMembers;
