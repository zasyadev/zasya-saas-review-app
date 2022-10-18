import { Col, Radio, Row } from "antd";
import moment from "moment";
import React, { useState } from "react";
import {
  ApplaudIcon,
  ApplaudIconSmall,
  ClockIcon,
  StarIcon,
} from "../../assets/icons";
import DefaultImages from "../common/DefaultImages";

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

  return (
    <>
      <div className="bg-white rounded-md shadow-md p-4">
        <Row justify="space-around">
          <Col xs={12} md={12} className="border-r border-slate-200">
            <div className=" flex flex-col items-center justify-center">
              <ApplaudIcon />

              <div>
                <p className="text-primary text-xl font-extrabold my-2">
                  {applaudCount}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={12} md={12}>
            <div className=" flex flex-col items-center justify-center">
              <StarIcon />

              <div>
                <p className="text-primary text-xl font-extrabold my-2">
                  {ratingHandler(reviewRating)}
                </p>
              </div>
            </div>
          </Col>
          <Col xs={24} md={24}>
            <hr className="my-3" />
          </Col>

          <Col xs={24} md={24}>
            <div className="py-2 px-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex-shrink-0 grid place-content-center">
                  <ClockIcon />
                </div>
                <div className="flex-1 flex items-center justify-around">
                  <div className="text-center">
                    <p className="text-primary text-xl font-extrabold my-2 ">
                      {tempTime.days()}
                    </p>
                    <p className="text-gray-500 text-sm xl:text-base mb-0">
                      Day(s)
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-primary text-xl font-extrabold my-2 ">
                      {tempTime.hours()}
                    </p>
                    <p className="text-gray-500 text-sm xl:text-base mb-0">
                      Hour(s)
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary text-xl font-extrabold my-2 ">
                      {tempTime.minutes()}
                    </p>
                    <p className="text-gray-500 text-sm xl:text-base mb-0">
                      Min(s).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      {monthlyLeaderBoardData.applaudData.length > 0 && (
        <div className="relative bg-white rounded-md shadow-md p-4 md:p-6 mt-6 ">
          <p className="mb-4 text-primary text-xl font-semibold pr-10 md:pr-14">
            Monthly Leaderboard
          </p>

          {monthlyLeaderBoardData.applaudData.map((item, idx) => {
            if (idx === activeMonthlyIndex) {
              return Object.entries(item).map(([key, value]) => (
                <div key={idx + "applaud"}>
                  <img
                    src={`/media/images/${
                      activeMonthlyIndex === 0
                        ? "badge_gold.png"
                        : "badge_silver.png"
                    }`}
                    className="absolute top-0 right-4 w-10 md:w-14 "
                  />
                  <div className="space-y-4">
                    <p className="mb-3 text-primary font-semibold  text-base  pr-10 md:pr-14">
                      Congratulations 🎉 <span className=" "> {key} !</span>
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
                            {value?.count} Applauds
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center slider-radio">
                    <Radio.Group
                      onChange={onChangeRadioHandler}
                      value={activeMonthlyIndex}
                      buttonStyle={"solid"}
                    >
                      <Radio value={0} />
                      <Radio value={1} />
                    </Radio.Group>
                  </div>
                </div>
              ));
            }
          })}
        </div>
      )}
    </>
  );
}

export default SiderRight;
