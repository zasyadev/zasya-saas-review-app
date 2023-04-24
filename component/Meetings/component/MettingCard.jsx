import {
  CalendarOutlined,
  ClockCircleOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Dropdown, Menu, Popconfirm } from "antd";
import { twMerge } from "tailwind-merge";
import { URLS } from "../../../constants/urls";
import { dateDayName, dateTime } from "../../../helpers/dateHelper";
import httpService from "../../../lib/httpService";
import { DateBox } from "../../DashBoard/component/helperComponent";
import { ButtonGray } from "../../common/CustomButton";
import { openNotificationBox } from "../../common/notification";
import { CASUAL_MEETINGTYPE, GOAL_TYPE, REVIEW_TYPE } from "../constants";

const FILTER_NAME = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

const meetingCardVarient = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const MettingCard = ({ item, user, fetchMeetingList }) => {
  async function handleOnDelete(id) {
    if (id) {
      await httpService
        .delete(`/api/meetings/${id}`, {})
        .then(({ data: response }) => {
          fetchMeetingList();
          openNotificationBox("success", response.message, 3);
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  async function handleIsCompleted(data) {
    await httpService
      .put(`/api/meetings/${data.id}`, { isCompleted: !data.is_completed })
      .then(({ data: response }) => {
        fetchMeetingList();
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message));
  }

  const ActionButton = ({ record }) => {
    return (
      <Dropdown
        trigger={"click"}
        overlay={
          <Menu className="divide-y">
            <Menu.Item key={"call-edit"}>
              <Link
                href={`${URLS.FOLLOW_UP_EDIT}/${record.id}/?tp=${CASUAL_MEETINGTYPE}`}
                passHref
              >
                Edit
              </Link>
            </Menu.Item>
            <Menu.Item key={"call-update"}>
              <Popconfirm
                title={`Are you sure to change the Status？`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleIsCompleted(record)}
                icon={false}
              >
                {!record.is_completed
                  ? FILTER_NAME.COMPLETED
                  : FILTER_NAME.PENDING}
              </Popconfirm>
            </Menu.Item>
            <Menu.Item key={"call-delete"}>
              <Popconfirm
                title={`Are you sure to delete ${record?.meeting_title}？`}
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleOnDelete(record.id)}
                icon={false}
              >
                Delete
              </Popconfirm>
            </Menu.Item>
          </Menu>
        }
        placement="bottomRight"
      >
        <ButtonGray
          className="grid place-content-center w-5 h-5 px-1"
          rounded="rounded-full"
          title={<EllipsisOutlined rotate={90} className="text-sm leading-0" />}
        />
      </Dropdown>
    );
  };

  return (
    <motion.div
      className={twMerge(
        clsx(
          "flex items-start space-x-3 px-3 py-2 bg-white rounded-md shadow-md",
          { "bg-white/70": item.is_completed }
        )
      )}
      variants={meetingCardVarient}
    >
      <div className="shrink-0">
        <DateBox
          date={item.meeting_at}
          className={twMerge(
            clsx("bg-brandRed-100", {
              "bg-brandBlue-300": item.meeting_type === REVIEW_TYPE,
              "bg-brandGreen-300": item.meeting_type === GOAL_TYPE,
            })
          )}
        />
      </div>

      <div className="flex-1">
        <p className="flex justify-between items-start  mb-2 font-medium text-sm break-all single-line-clamp">
          <Link href={`${URLS.FOLLOW_UP}/${item.id}`} passHref>
            <span className="hover:underline cursor-pointer">
              {item.meeting_title}
            </span>
          </Link>

          {user.id === item.created_by && (
            <span className="ml-2">
              <ActionButton record={item} />
            </span>
          )}
        </p>
        <div className="flex justify-between items-center">
          <span className="flex  items-center text-brandGray-600">
            <span className="leading-0 text-primary-green pr-1 text-sm">
              <CalendarOutlined />
            </span>

            {dateDayName(item.meeting_at)}
          </span>
          <span className="flex  items-center text-brandGray-600">
            <span className="leading-0 text-primary-green pr-1 text-sm">
              <ClockCircleOutlined />
            </span>
            {dateTime(item.meeting_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MettingCard;
