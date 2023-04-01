import {
  CalendarOutlined,
  ClockCircleOutlined,
  EllipsisOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Calendar, Dropdown, Menu, Popconfirm, Popover, Select } from "antd";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MemberListHook } from "../../component/common/hooks";
import { URLS } from "../../constants/urls";
import { dateDayName, dateTime } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
import { openNotificationBox } from "../common/notification";
import { DateBox } from "../DashBoard/component/helperComponent";
import MeetingListSkeleton from "./component/MeetingListSkeleton";
import { CASUAL_MEETINGTYPE, GOAL_TYPE, REVIEW_TYPE } from "./constants";

const currentTime = moment().format();

function MeetingsList({ user }) {
  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);
  const [filterId, setFilterId] = useState("ALL");
  const { membersList } = MemberListHook(user);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings?filterId=${filterId}`)
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
  }, [filterId]);

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

  const dateCellRender = (value) => {
    const startOfToday = moment(value).startOf("day");
    const endOfToday = moment(value).endOf("day");

    const filterList = meetingsList.filter((item) => {
      if (
        moment(item.meeting_at) < endOfToday &&
        moment(item.meeting_at) >= startOfToday
      )
        return item;
    });

    return (
      <div className="space-y-2">
        {filterList.map((item) => (
          <p
            key={item.id}
            className="text-xs single-line-clamp px-1 rounded-sm"
          >
            <Popover
              content={
                <Link href={`${URLS.FOLLOW_UP}/${item.id}`} passHref>
                  <span className="hover:underline cursor-pointer font-medium">
                    {item.meeting_title}
                  </span>
                </Link>
              }
              trigger={["click", "hover"]}
              placement="top"
              overlayClassName="max-w-sm"
            >
              <span
                className={twMerge(
                  clsx(
                    "relative inline-block w-1 h-1 rounded-full mr-0.5 mb-0.5 bg-brandRed-100",
                    {
                      "bg-brandBlue-300": item.meeting_type === REVIEW_TYPE,
                      "bg-brandGreen-300": item.meeting_type === REVIEW_TYPE,
                    }
                  )
                )}
              ></span>
              {item.meeting_title}
            </Popover>
          </p>
        ))}
      </div>
    );
  };

  const ActionButton = ({ record }) => {
    return (
      <Dropdown
        trigger={"click"}
        overlay={
          <Menu className="divide-y">
            <Menu.Item>
              <Link
                href={`${URLS.FOLLOW_UP_EDIT}/${record.id}/?tp=${CASUAL_MEETINGTYPE}`}
                passHref
              >
                Edit
              </Link>
            </Menu.Item>
            <Menu.Item>
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
    <div className="container mx-auto max-w-full">
      <div className="md:flex  justify-between items-center gap-4 mb-4 md:mb-6 ">
        <p className="text-xl font-semibold mb-0">Follow Ups</p>
        <div className="space-x-2 flex items-center justify-end">
          <Select
            size="large"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            className="w-44 text-sm"
            placeholder="Search Member"
            suffixIcon={<SearchOutlined />}
            onSelect={(e) => {
              setFilterId(e);
            }}
          >
            <Select.Option value="ALL">All</Select.Option>
            {membersList.map((data) => (
              <Select.Option
                key={data.user_id + "_member"}
                value={data.user_id}
              >
                {data.user.first_name}
              </Select.Option>
            ))}
          </Select>
          <PrimaryButton
            withLink={true}
            linkHref={URLS.FOLLOW_UP_CREATE}
            title={"Create"}
          />
        </div>
      </div>
      {loading ? (
        <MeetingListSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-4 max-h-screen overflow-auto custom-scrollbar">
              {Number(meetingsList.length) > 0
                ? meetingsList.map((item, idx) => (
                    <div
                      className="flex items-center space-x-3 px-3 py-2 bg-white rounded-md shadow-md"
                      key={idx + "list"}
                    >
                      <div className="shrink-0">
                        <DateBox
                          date={item.meeting_at}
                          className={twMerge(
                            clsx("bg-brandRed-100", {
                              "bg-brandBlue-300":
                                item.meeting_type === REVIEW_TYPE,
                              "bg-brandGreen-300":
                                item.meeting_type === GOAL_TYPE,
                            })
                          )}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="flex justify-between items-center  mb-2 font-medium text-sm break-all single-line-clamp">
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
                    </div>
                  ))
                : null}
            </div>
            <div className="col-span-2 p-2 bg-white rounded-md shadow-md">
              <Calendar dateCellRender={dateCellRender} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MeetingsList;
