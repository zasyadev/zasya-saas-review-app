import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Col, Popconfirm, Row, Skeleton } from "antd";
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
          console.error(err.response.data.message);
          openNotificationBox("error", err.response.data.message);
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
          let data = response.data.filter(
            (item) => item.user_id != user.id && item.role_id != 2
          );

          setMembersList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err.response.data.message);
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
        <div className="grid grid-cols-1  md:grid-cols-3 gap-2">
          {" "}
          {record?.tags?.length > 0
            ? record?.tags.map((item, index) => (
                <span
                  className="text-sm text-center bg-sky-300  text-white rounded px-2 py-1"
                  key={index + "tags"}
                >
                  {item}
                </span>
              ))
            : null}
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <p>
          <Link href={`/team/edit/${record.user_id}`}>
            <EditOutlined
              className="primary-color-blue text-xl mx-1  md:mx-2 cursor-pointer"
              // onClick={() => onUpdate(record)}
            />
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
            <DeleteOutlined className="text-color-red text-xl mx-1 md:mx-2 cursor-pointer" />
          </Popconfirm>
        </p>
      ),
    },
  ];
  return (
    <>
      <Row>
        <Col sm={24} md={24}>
          <div className="px-3 md:px-8 h-auto mt-5">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 px-4 mb-16">
                <div className="flex justify-end">
                  <div className="my-2 ">
                    <PrimaryButton
                      withLink={true}
                      className="rounded-md  px-2 md:px-4 "
                      linkHref="/team/add"
                      title={"Create"}
                    />
                  </div>
                </div>

                <div className="w-full bg-white rounded-xl overflow-hdden shadow-md px-4 pb-4 ">
                  <div className="p-4 ">
                    <div className="overflow-x-auto">
                      {loading ? (
                        <Skeleton
                          title={false}
                          active={true}
                          width={[200]}
                          className="mt-4"
                          rows={3}
                        />
                      ) : (
                        <CustomTable
                          dataSource={membersList}
                          columns={columns}
                          className="custom-table"
                          pagination={{
                            defaultPageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50", "100"],
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}

export default TeamMembers;
