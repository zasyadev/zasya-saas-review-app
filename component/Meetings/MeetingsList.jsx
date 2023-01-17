import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { DEFAULT_DATETIME_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { openNotificationBox } from "../common/notification";
import MeetingListSkeleton from "./component/MeetingListSkeleton";
import { CASUAL_MEETINGTYPE } from "./constants";

function GoalsList({ user }) {
  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMeetingsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  useEffect(() => {
    fetchMeetingList();
  }, []);

  async function handleOnDelete(id) {
    if (id) {
      await httpService
        .delete(`/api/meetings/${id}`, {})
        .then(({ data: response }) => {
          if (response.status === 200) {
            fetchMeetingList();
            openNotificationBox("success", response.message, 3);
          }
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  const columns = [
    {
      title: "Title",
      key: "meeting_title",
      render: (_, record) => (
        <Link href={`/meetings/${record.id}`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0 underline">
            {record.meeting_title}
          </p>
        </Link>
      ),
    },

    {
      title: "Meeting Date",
      key: "meeting_at",
      render: (_, record) =>
        moment(record.meeting_at).format(DEFAULT_DATETIME_FORMAT),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        user.id === record.created_by && (
          <p>
            <Link
              href={`/meetings/edit/${record.id}/?tp=${CASUAL_MEETINGTYPE}`}
              passHref
            >
              <EditOutlined className="primary-color-blue text-xl mx-1  md:mx-2 cursor-pointer" />
            </Link>

            <Popconfirm
              title={`Are you sure to delete ${record?.meeting_title}？`}
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleOnDelete(record.id)}
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
      {loading ? (
        <MeetingListSkeleton />
      ) : (
        <>
          <div className="flex  justify-end items-center gap-4 mb-4 md:mb-6 ">
            <PrimaryButton
              withLink={true}
              linkHref={`/meetings/add`}
              title={"Create"}
            />
          </div>
          <CustomTable
            dataSource={meetingsList}
            columns={columns}
            className="custom-table"
            isPagination
          />
        </>
      )}
    </div>
  );
}

export default GoalsList;
