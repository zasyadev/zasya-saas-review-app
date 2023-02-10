import { Col, Row } from "antd";
import moment from "moment";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import {
  ApplaudIcon,
  ClockIcon,
  FileLeftIcon,
  FileRightIcon,
  StarIcon,
} from "../../assets/icons";
import DefaultImages from "../common/DefaultImages";

const SemiDonutChart = dynamic(() => import("../common/SemiDonutChart"), {
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

  return Number(avgRating).toFixed(2);
};

function SiderRight({ dashBoardData, monthlyLeaderBoardData }) {
  const { reviewRating, averageAnswerTime, applaudCount } = dashBoardData;
  const tempTime = moment.duration(averageAnswerTime);
  const [activeMonthlyIndex, setActiveMonthlyIndex] = useState(0);

  const onChangeRadioHandler = (e) => {
    setActiveMonthlyIndex(e.target.value);
  };
  const feedbackList = [];

  return (
    <>
      <div className="space-y-2">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Performance Stats
        </div>
        <div className="relative">
          <SemiDonutChart />
          <div className="w-20 h-20 bg-white rounded-full absolute bottom-5 left-32 grid place-content-center">
            <div className="rounded-full bg-gray-300 w-16 h-16 grid place-content-center font-bold text-lg">
              {ratingHandler(reviewRating)}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between px-4">
          <div className="flex-shrink-0 grid place-content-center">
            <ClockIcon />
          </div>
          <div className="flex-1 flex items-center justify-around">
            <div className="text-center">
              <p className=" text-xl font-extrabold my-2 ">{tempTime.days()}</p>
              <p className="text-gray-500 text-sm xl:text-base mb-0">Day(s)</p>
            </div>

            <div className="text-center">
              <p className=" text-xl font-extrabold my-2 ">
                {tempTime.hours()}
              </p>
              <p className="text-gray-500 text-sm xl:text-base mb-0">Hour(s)</p>
            </div>
            <div className="text-center">
              <p className=" text-xl font-extrabold my-2 ">
                {tempTime.minutes()}
              </p>
              <p className="text-gray-500 text-sm xl:text-base mb-0">Min(s).</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold">
          Recent Activity
        </div>
      </div>
      <div className="space-y-4">
        <div className="border-b border-gray-300 pb-2 text-lg font-semibold ">
          Leaderboard
        </div>
        {/* {feedbackList.length > 0 ? (
                      feedbackList.map((feedback, idx) => { */}
        {/* return  */}
        <div className="flex px-4 space-x-4">
          <div>
            <DefaultImages imageSrc={""} width={70} height={70} />
          </div>

          <div className="">
            <div className="px-4">
              <p className="mb-2 text-primary font-medium text-sm">{"Name"}</p>
              <p className="flex justify-between space-x-4">
                <span className="flex" title="Feedback given">
                  <FileRightIcon />
                  <span className="pl-2 text-sm font-medium text-gray-500">
                    {2}
                  </span>
                </span>
                <span className="flex" title="Feedback received">
                  <FileLeftIcon />
                  <span className="pl-2 text-sm font-medium text-gray-500">
                    {2}
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* ));
                      })
                    ) : (
                      <div className="flex justify-center items-center h-48 ">
                        <p className="text-center">No Record Found</p>
                      </div>
                    )} */}
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
