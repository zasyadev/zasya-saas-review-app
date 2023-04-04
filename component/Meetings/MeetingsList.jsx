import {
  CalendarOutlined,
  ClockCircleOutlined,
  EllipsisOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Calendar, Dropdown, Menu, Popconfirm, Popover, Select } from "antd";
import clsx from "clsx";
import { motion } from "framer-motion";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { MemberListHook } from "../../component/common/hooks";
import { URLS } from "../../constants/urls";
import { dateDayName, dateTime } from "../../helpers/dateHelper";
import { endOfDate, startOfDate } from "../../helpers/momentHelper";
import httpService from "../../lib/httpService";
import { DateBox } from "../DashBoard/component/helperComponent";
import { DefaultMotionVarient } from "../Template/constants";
import CountHeaderCard from "../common/CountHeaderCard";
import { ButtonGray, PrimaryButton } from "../common/CustomButton";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import MeetingListSkeleton from "./component/MeetingListSkeleton";
import { CASUAL_MEETINGTYPE, GOAL_TYPE, REVIEW_TYPE } from "./constants";

const currentTime = moment().format();

const SORT_BY_TIME = {
  TODAY: "today",
  COMPLETED: "completed",
  UPCOMING: "upcoming",
  ALL: "all",
};

const meetingCardVarient = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};
const startOfDay = startOfDate(moment());
const endOfDay = endOfDate(moment());

const meetingFilterData = (list, type) => {
  return list.filter((record) => {
    const meetingTime = moment(record.meeting_at);
    switch (type) {
      case SORT_BY_TIME.TODAY:
        return meetingTime <= endOfDay && meetingTime >= startOfDay;
      case SORT_BY_TIME.UPCOMING:
        return meetingTime >= endOfDay;
      case SORT_BY_TIME.COMPLETED:
        return meetingTime <= startOfDay;
      default:
        return record;
    }
  });
};

function MeetingsList({ user }) {
  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);
  const [filterId, setFilterId] = useState("ALL");
  const [filterType, setFilterType] = useState(SORT_BY_TIME.TODAY);
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
    const filterList = filteredMeetingList.filter(
      (item) =>
        moment(item.meeting_at) < endOfDate(value) &&
        moment(item.meeting_at) >= startOfDate(value)
    );

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

  const filteredMeetingList = useMemo(() => {
    return meetingFilterData(meetingsList, filterType);
  }, [meetingsList, filterType]);

  const getCountBySort = (data) => {
    return meetingFilterData(meetingsList, data).length;
  };

  const headerCard = [
    {
      imgSrc: "/media/svg/contract-management.svg",
      imgSrcClassNames: "bg-brandGreen-200",
      title: SORT_BY_TIME.TODAY,
      subTitle: getCountBySort(SORT_BY_TIME.TODAY),
    },
    {
      imgSrc: "/media/svg/completed-goals.svg",
      imgSrcClassNames: "bg-brandOrange-200",
      title: SORT_BY_TIME.COMPLETED,
      subTitle: getCountBySort(SORT_BY_TIME.COMPLETED),
    },
    {
      imgSrc: "/media/svg/contract-pending.svg",
      imgSrcClassNames: "bg-brandBlue-200",
      title: SORT_BY_TIME.UPCOMING,
      subTitle: getCountBySort(SORT_BY_TIME.UPCOMING),
    },
    {
      imgSrc: "/media/svg/assign-user.svg",
      imgSrcClassNames: "bg-brandGreen-400",
      title: SORT_BY_TIME.ALL,
      subTitle: getCountBySort(SORT_BY_TIME.ALL),
    },
  ];

  return (
    <div className="container mx-auto max-w-full">
      <div className="gap-4 mb-4 md:mb-6 ">
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

        <div className="grid col-span-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {headerCard.map((card, index) => (
            <CountHeaderCard
              imgSrc={card.imgSrc}
              imgSrcClassNames={card.imgSrcClassNames}
              title={card.title}
              subTitle={card.subTitle}
              onClick={() => setFilterType(card.title)}
              className="cursor-pointer"
              key={card.title + index}
            />
          ))}
        </div>
      </div>
      {loading ? (
        <MeetingListSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 ">
          <motion.div
            className="space-y-4 max-h-screen overflow-auto custom-scrollbar mb-4 md:mb-0"
            variants={DefaultMotionVarient}
            initial="hidden"
            animate="show"
          >
            {Number(filteredMeetingList.length) > 0 ? (
              filteredMeetingList.map((item, idx) => (
                <motion.div
                  className="flex items-center space-x-3 px-3 py-2 bg-white rounded-md shadow-md"
                  key={idx + "list"}
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
                </motion.div>
              ))
            ) : (
              <NoRecordFound title="No Meetings Found" />
            )}
          </motion.div>
          <div className="col-span-2 p-2 bg-white rounded-md shadow-md">
            <Calendar dateCellRender={dateCellRender} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingsList;
