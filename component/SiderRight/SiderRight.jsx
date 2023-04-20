import { Skeleton, Timeline } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import React from "react";
import {
  ApplaudIconSmall,
  FileLeftIcon,
  FileRightIcon,
} from "../../assets/icons";

import { SCALE_TYPE } from "../Form/questioncomponents/constants";
import { REVIEW_RATING_QUESTION } from "../Review/constants";
import DefaultImages from "../common/DefaultImages";
import { useActivity } from "../common/hooks/useActivity";
import { getFirstLetter, getRandomBgColor } from "../../helpers/utils";

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
        if (curr.ReviewAssigneeAnswerOption?.length > 0) {
          let ratingQuestion = curr.ReviewAssigneeAnswerOption.find(
            (i) =>
              i.question.questionText === REVIEW_RATING_QUESTION &&
              i.question.type === SCALE_TYPE
          );
          if (!ratingQuestion) return 0;
          if (isNaN(Number(ratingQuestion.option))) {
            return 0;
          } else {
            return Number(prev) + Number(ratingQuestion.option);
          }
        } else return 0;
      }, sum);

      let averageRating =
        Number(totalrating) / Number(item.ReviewAssigneeAnswers.length);

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
  const { reviewRating, totalGoals, totalApplauds } = dashBoardData;
  const { leaderBoardData, leaderboardLoading } = monthlyLeaderBoardData;

  const { activityList, activityListLoading } = useActivity(userId);

  return (
    <>
      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Performance Stats
        </div>
        <RadialBarChart
          totalGoals={totalGoals}
          totalApplauds={totalApplauds}
          reviewRating={ratingHandler(reviewRating)}
        />
      </div>
      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Recent Activity
        </div>

        {activityListLoading ? (
          <Skeleton
            avatar
            active
            paragraph={{
              rows: 1,
            }}
          />
        ) : (
          activityList.length > 0 && (
            <Timeline className="px-4 pt-6 space-y-2 max-h-72 overflow-auto no-scrollbar">
              {activityList.map((item, index) => (
                <Timeline.Item
                  dot={
                    <div
                      className={
                        "border text-white capitalize  rounded-full w-7 h-7 grid place-content-center"
                      }
                      style={{ backgroundColor: getRandomBgColor(index * 3) }}
                    >
                      {getFirstLetter(item.type)}
                    </div>
                  }
                  className="recent-activity-timeline"
                  key={item.id + "activity"}
                >
                  <div className="flex items-start gap-2 ">
                    <p className="flex-1 font-semibold mb-0 text-sm md:text-base">
                      <span className="capitalize">{item.title}</span>
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

      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold ">
          Leaderboard
        </div>
        <div className="px-4 space-y-4 max-h-64 md:max-h-80 lg:max-h-64 overflow-y-auto no-scrollbar">
          {leaderboardLoading
            ? [1, 2, 3].map((_, index) => (
                <Skeleton
                  avatar
                  active
                  paragraph={{
                    rows: 1,
                  }}
                  key={index + "leaderboadLoading"}
                />
              ))
            : leaderBoardData.length > 0 &&
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

                      <div>
                        <div className="px-4 md:pl-0 xl:pl-4">
                          <p className="mb-2 font-medium text-sm">
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

      {/*
      
      //ToDo : This is monthly leaderborad 

      {monthlyLeaderBoardData.applaudData.length > 0 && (
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
