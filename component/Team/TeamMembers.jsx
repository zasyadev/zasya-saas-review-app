import React, { useState, useEffect } from "react";
import {
  Button,
  Layout,
  Modal,
  Form,
  Row,
  Col,
  Skeleton,
  Select,
  Input,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { openNotificationBox } from "../../helpers/notification";
import CustomTable from "../../helpers/CustomTable";
import Link from "next/link";
// import SiderRight from "../SiderRight/SiderRight";

function TeamMembers({ user }) {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [upadteData, setUpdateData] = useState({});

  async function onDelete(email) {
    if (email) {
      await fetch("/api/team/members", {
        method: "DELETE",
        body: JSON.stringify({
          email: email,
          created_by: user.id,
        }),
        // headers: {
        //   "Content-Type": "application/json",
        // },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.status === 200) {
            fetchMembersData();
            openNotificationBox("success", response.message, 3);
          } else {
            openNotificationBox("error", response.message, 3);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  async function fetchMembersData() {
    setLoading(true);
    setMembersList([]);
    await fetch("/api/team/" + user.id, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.status === 200) {
          let data = response.data.filter((item) => item.user_id != user.id);
          setMembersList(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setMembersList([]);
      });
  }

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };
  // const onUpdate = (data) => {
  //   setEditMode(true);
  //   setUpdateData(data);
  //   setIsModalVisible(true);

  //   form.setFieldsValue({
  //     first_name: data.first_name,
  //     last_name: data.last_name,
  //     email: data.email,
  //     tags: data.UserTags.tags,
  //     status: data.status,
  //     role: data.role_id,
  //   });
  // };

  const onCancel = () => {
    form.resetFields();
    if (editMode) setEditMode(false);
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchMembersData();
  }, []);

  const columns = [
    {
      title: "Name",
      key: "id",
      render: (_, record) =>
        record?.user.first_name + " " + record?.user?.last_name,
    },
    {
      title: "Email",
      render: (_, record) => record?.user.email,
    },
    {
      title: "Tags",

      render: (_, record) =>
        record?.tags?.length > 0
          ? record?.tags.map((item, index) => (
              <span className="mx-2" key={index + "tags"}>
                {item}
              </span>
            ))
          : null,
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
            <DeleteOutlined className="text-red-500 text-xl mx-1 md:mx-2 cursor-pointer" />
          </Popconfirm>
        </p>
      ),
    },
  ];
  console.log(membersList, "membersList");
  return (
    <>
      <Row>
        <Col sm={24} md={24}>
          <div className="px-3 md:px-8 h-auto mt-5">
            <div className="container mx-auto max-w-full">
              <div className="grid grid-cols-1 px-4 mb-16">
                {/* <div className="grid sm:flex bg-gradient-to-tr from-purple-500 to-purple-700 -mt-10 mb-4 rounded-xl text-white  items-center w-full h-40 sm:h-24 py-4 px-6 md:px-8 justify-between shadow-lg-purple ">
              <h2 className="text-white text-2xl font-bold ">Team Members </h2>
              <span
                className="text-center  rounded-full border-2 px-4 py-2 cursor-pointer hover:bg-white hover:text-purple-500 hover:border-2 hover:border-purple-500 "
                onClick={showModal}
              >
                Create
              </span>
            </div> */}

                <div className="md:flex justify-end">
                  <div className="my-2 ">
                    <Link href="/team/add">
                      <button
                        className="primary-bg-btn text-white text-sm md:py-3 py-2 text-center md:px-4 px-2 rounded-md w-full"
                        // onClick={() => showModal()}
                      >
                        Create Team
                      </button>
                    </Link>
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
                          pagination={false}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        {/* <Col sm={24} md={24} lg={7} className="mt-6 ">
          <SiderRight />
        </Col> */}
      </Row>
    </>
  );
}

export default TeamMembers;
