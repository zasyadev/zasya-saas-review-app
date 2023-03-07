import { ClockCircleOutlined } from "@ant-design/icons";
import { Skeleton, Timeline } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import React from "react";
import {
  ApplaudIconSmall,
  FileLeftIcon,
  FileRightIcon,
} from "../../assets/icons";
import { getFirstLetter } from "../../helpers/truncateString";
import DefaultImages from "../common/DefaultImages";
import { NotificationListHook } from "../common/hooks";

const RadialBarChart = dynamic(() => import("../common/RadialBarChart"), {
  ssr: false,
});

const ratingHandler = (data) => {
  if (data.length === 0) {
    return 0;
  }
  let sum = 0;
  let total = data.map((item) => {
    if (item.ReviewAssigneeAnswers.length > 0) {
      let totalrating = item.ReviewAssigneeAnswers.reduce((prev, curr) => {
        if (curr?.ReviewAssigneeAnswerOption?.length > 0) {
          if (isNaN(Number(curr?.ReviewAssigneeAnswerOption[0].option))) {
            return 0;
          } else {
            return (
              Number(prev) + Number(curr?.ReviewAssigneeAnswerOption[0].option)
            );
          }
        } else return 0;
      }, sum);

      let averageRating =
        Number(totalrating) / Number(item?.ReviewAssigneeAnswers?.length);

      return averageRating;
    } else return 0;
  });
  let avgSum = 0;

  let avgRatingSum = total.reduce((prev, curr) => {
    return Number(prev) + Number(curr);
  }, avgSum);

  let assigneAnswerLength = data.filter((item) =>
    item?.ReviewAssigneeAnswers?.length > 0 ? item : null
  );

  let avgRating = 0;
  if (avgRatingSum > 0) avgRating = avgRatingSum / assigneAnswerLength.length;

  return Number(avgRating).toFixed(1);
};

function SiderRight({ dashBoardData, monthlyLeaderBoardData, userId }) {
  const { reviewRating, averageAnswerTime, totalGoals, totalApplauds } =
    dashBoardData;
  const { leaderBoardData, leaderboardLoading } = monthlyLeaderBoardData;

  const tempTime = moment.duration(averageAnswerTime);
  // const [activeMonthlyIndex, setActiveMonthlyIndex] = useState(0);

  // const onChangeRadioHandler = (e) => {
  //   setActiveMonthlyIndex(e.target.value);
  // };

  const { notificationList, notificationListLoading } =
    NotificationListHook(userId);

  return (
    <>
      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Performance Stats
        </div>
        <div className="">
          <RadialBarChart
            totalGoals={totalGoals}
            totalApplauds={totalApplauds}
            reviewRating={ratingHandler(reviewRating)}
          />
          {/* <div className="relative">
            <div className="w-20 h-20 md:w-16 md:h-16 2xl:w-20 2xl:h-20 bg-white rounded-full absolute bottom-8 left-36 lg:bottom-4 lg:left-28 xl:bottom-5  xl:left-28 2xl:bottom-20 2xl:left-48 grid place-content-center">
              <div className="rounded-full bg-gray-300 w-16 h-16 md:w-12 md:h-12 2xl:w-16 2xl:h-16 grid place-content-center font-bold text-lg">
                {ratingHandler(reviewRating)}
              </div>
            </div>
          </div> */}
        </div>
        {/* <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex-shrink-0 grid place-content-center">
            <ClockCircleOutlined className="text-3xl md:text-2xl xl:text-4xl" />
          </div>
          <div className="flex-1 flex items-center justify-around">
            <div className="text-center">
              <p className=" text-xl md:text-base xl:text-xl font-extrabold my-2 ">
                {tempTime.days()}
              </p>
              <p className="text-gray-500 text-sm md:text-xs xl:text-base mb-0">
                Day
              </p>
            </div>

            <div className="text-center">
              <p className=" text-xl md:text-base xl:text-xl font-extrabold my-2 ">
                {tempTime.hours()}
              </p>
              <p className="text-gray-500 text-sm md:text-xs xl:text-base mb-0">
                Hour
              </p>
            </div>
            <div className="text-center">
              <p className=" text-xl  md:text-base xl:text-xl font-extrabold my-2 ">
                {tempTime.minutes()}
              </p>
              <p className="text-gray-500 text-sm md:text-xs xl:text-base mb-0">
                Min
              </p>
            </div>
          </div>
        </div> */}
      </div>
      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Recent Activity
        </div>

        {notificationListLoading ? (
          <Skeleton
            avatar
            active
            paragraph={{
              rows: 1,
            }}
          />
        ) : (
          notificationList && (
            <Timeline className="px-4 pt-6 space-y-2 max-h-64 overflow-auto no-scrollbar">
              {notificationList.map((item, index) => (
                <Timeline.Item
                  dot={
                    <div
                      className={`${
                        index === 0
                          ? "bg-cyan-500"
                          : index === 1
                          ? "bg-orange-600"
                          : "bg-green-600"
                      } 
           
           border text-white capitalize hover:cursor-pointer rounded-full w-7 h-7 grid place-content-center`}
                    >
                      {getFirstLetter(item.data.message)}
                    </div>
                  }
                  className="recent-activity-timeline"
                  key={item.id + "activity"}
                >
                  <div className="flex items-start gap-2 ">
                    <p className="flex-1 font-semibold mb-0 text-sm md:text-base">
                      <span className="capitalize">{item.data.message}</span>
                    </p>
                  </div>

                  {item.created_date && (
                    <p className="mt-1 mb-0  text-gray-400  text-xs leading-6 ">
                      {moment(item.created_date).fromNow()}
                    </p>
                  )}
                </Timeline.Item>
              ))}
            </Timeline>
          )
        )}
      </div>

      <div className="space-y-4">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold ">
          Leaderboard
        </div>
        <div className=" px-4 space-y-4 max-h-64 overflow-y-auto no-scrollbar">
          {leaderboardLoading
            ? [...Array(3)].map((_, index) => (
                <Skeleton
                  avatar
                  active
                  paragraph={{
                    rows: 1,
                  }}
                  key={index + "leaderboadLoading"}
                />
              ))
            : leaderBoardData &&
              leaderBoardData
                .filter((i) => i.status)
                .map((item, index) => {
                  return (
                    <div className="flex space-x-4" key={item.id + index}>
                      <div>
                        <DefaultImages
                          imageSrc={item.UserDetails.image}
                          width={65}
                          height={65}
                        />
                      </div>

                      <div className="">
                        <div className="px-4 md:pl-0 xl:pl-4">
                          <p className="mb-2 text-primary font-medium text-sm">
                            {item.first_name}
                          </p>
                          <p className="flex justify-between space-x-4">
                            <span className="flex" title="Feedback given">
                              <ApplaudIconSmall />
                              <span className="pl-2 text-sm font-medium text-gray-500">
                                {item?.userFeild?.length ?? 0}
                              </span>
                            </span>
                            <span className="flex" title="Feedback given">
                              <FileRightIcon />
                              <span className="pl-2 text-sm font-medium text-gray-500">
                                {item?.ReviewAssigneeAnswers?.length ?? 0}
                              </span>
                            </span>
                            <span className="flex" title="Feedback received">
                              <FileLeftIcon />
                              <span className="pl-2 text-sm font-medium text-gray-500">
                                {item?.taskReviewBy?.length ?? 0}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
        </div>
      </div>

      {/* {monthlyLeaderBoardData.applaudData.length > 0 && (
        <div className="relative bg-white rounded-md shadow-md p-5  mt-6 ">
          <p className="mb-4 text-primary text-xl font-semibold pr-10 md:pr-14">
            Monthly Leaderboard
          </p>

          {monthlyLeaderBoardData.applaudData.map((item, idx) => {
            if (idx === activeMonthlyIndex) {
              return Object.entries(item).map(([key, value]) => (
                <div key={idx + "monthlyapplaud"}>
                  <img
                    src={`/media/images/${
                      activeMonthlyIndex === 0
                        ? "badge_gold.png"
                        : "badge_silver.png"
                    }`}
                    className="absolute top-0 right-4 w-10 md:w-14 "
                    alt="badge"
                  />
                  <div className="space-y-4">
                    <p className="mb-3 text-primary font-semibold  text-base  pr-10 md:pr-14">
                      Congratulations 🎉 {key} !
                    </p>
                    <div className="flex items-center space-x-4 ">
                      <div className="shrink-0">
                        <DefaultImages
                          imageSrc={value?.image}
                          width={80}
                          height={80}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="flex mb-2 text-primary font-medium text-sm">
                          <ApplaudIconSmall />
                          <span className="pl-2 text-sm font-medium ">
                            {value?.count} Applaud(s)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  {monthlyLeaderBoardData.applaudData.length > 1 && (
                    <div className="text-center slider-radio">
                      <Radio.Group
                        onChange={onChangeRadioHandler}
                        value={activeMonthlyIndex}
                      >
                        <Radio value={0} />
                        <Radio value={1} />
                      </Radio.Group>
                    </div>
                  )}
                </div>
              ));
            }
          })}
        </div>
      )} */}
    </>
  );
}

export default SiderRight;
