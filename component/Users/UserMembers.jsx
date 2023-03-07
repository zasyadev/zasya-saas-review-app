import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm, Skeleton } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { URLS } from "../../constants/urls";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { openNotificationBox } from "../common/notification";

function UserMembers({ user }) {
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);

  async function onDelete(email) {
    if (email) {
      await httpService
        .delete(`/api/member`, {
          data: {
            email: email,
          },
        })
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchMembersData();
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function fetchMembersData() {
    setLoading(true);
    setMembersList([]);
    await httpService
      .get(`/api/member/${user.id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.user_id != user.id);

          setMembersList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
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
            <Link href={`${URLS.USER_EDIT}/${record.user_id}`} passHref>
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
      <div className="flex flex-row items-center justify-between flex-wrap gap-4  mb-2 xl:mb-4 ">
        <p className="text-xl font-semibold mb-0">Users</p>
        <PrimaryButton
          withLink={true}
          className="px-2 md:px-4 "
          linkHref={URLS.USER_CREATE}
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

export default UserMembers;
