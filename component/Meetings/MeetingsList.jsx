import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { URLS } from "../../constants/urls";
import { DEFAULT_DATETIME_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import { openNotificationBox } from "../common/notification";
import MeetingListSkeleton from "./component/MeetingListSkeleton";
import { CASUAL_MEETINGTYPE } from "./constants";

const currentTime = moment().format();

function MeetingsList({ user }) {
  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          let sortData = response.data.sort((a, b) => {
            if (a.meeting_at < currentTime && b.meeting_at >= currentTime) {
              return 1; // a should come after b in the sorted order
            }
            if (b.meeting_at < currentTime && a.meeting_at >= currentTime) {
              return -1; // a should come before b in the sorted order
            }
            return 0; // a and b are equal
          });

          setMeetingsList(sortData);
        }
        setLoading(false);
      })
      .catch((err) => {});
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
        <Link href={`${URLS.FOLLOW_UP}/${record.id}`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0 underline max-w-xs lg:max-w-md">
            {record.meeting_title}
          </p>
        </Link>
      ),
      sorter: (a, b) => a.meeting_title?.localeCompare(b.meeting_title),
    },
    {
      title: "Type",
      key: "meeting_type",
      dataIndex: "meeting_type",
      sorter: (a, b) => a.meeting_type?.localeCompare(b.meeting_type),
    },

    {
      title: "Date / Time",
      key: "meeting_at",
      render: (_, record) =>
        moment(record.meeting_at).format(DEFAULT_DATETIME_FORMAT),
      sorter: (a, b) => new Date(b.meeting_at) - new Date(a.meeting_at),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) =>
        user.id === record.created_by && (
          <p>
            <Link
              href={`${URLS.FOLLOW_UP_EDIT}/${record.id}/?tp=${CASUAL_MEETINGTYPE}`}
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
              linkHref={URLS.FOLLOW_UP_CREATE}
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

export default MeetingsList;
