import { SearchOutlined } from "@ant-design/icons";
import { Calendar, Popover, Select } from "antd";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { URLS } from "../../constants/urls";
import { endOfDate, startOfDate } from "../../helpers/momentHelper";
import httpService from "../../lib/httpService";
import CountHeaderCard from "../common/CountHeaderCard";
import { PrimaryButton } from "../common/CustomButton";
import NoRecordFound from "../common/NoRecordFound";
import { useMember } from "../common/hooks/useMember";
import { REVIEW_TYPE, SORT_BY_TIME } from "./constants";
import { MeetingCardWrapper, MeetingListSkeleton } from "./component";

const currentTime = moment().format();
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
        return meetingTime <= startOfDay || record.is_completed;
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
  const { membersList } = useMember(user);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings?filterId=${filterId}`)
      .then(({ data: response }) => {
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
      })
      .catch(() => setMeetingsList([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchMeetingList();
  }, [filterId]);

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
              className={clsx(
                "cursor-pointer border-t-4 border-transparent hover:border-primary-green  hover:bg-brandGray-100 hover:border-t-4",
                {
                  "border-primary-green bg-brandGray-100 border-t-4":
                    card.title === filterType,
                }
              )}
              key={card.title + index}
            />
          ))}
        </div>
      </div>
      {loading ? (
        <MeetingListSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 ">
          <div className="space-y-2 xl:space-y-4 max-h-full mb-4 md:mb-0">
            {filteredMeetingList.length > 0 ? (
              <MeetingCardWrapper
                list={filteredMeetingList}
                user={user}
                fetchMeetingList={fetchMeetingList}
                filterType={filterType}
              />
            ) : (
              <NoRecordFound title="No Meetings Found" />
            )}
          </div>
          <div className="col-span-2 p-2 bg-white rounded-md shadow-md">
            <Calendar dateCellRender={dateCellRender} />
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingsList;
