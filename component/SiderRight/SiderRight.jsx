import { Col, Row } from "antd";
import moment from "moment";
import React from "react";
import { ApplaudIcon, ClockIcon, StarIcon } from "../../assets/icons";

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

function SiderRight({ dashBoardData }) {
  const { reviewRating, averageAnswerTime, applaudCount } = dashBoardData;
  const tempTime = moment.duration(averageAnswerTime);
  return (
    <div className="mx-3 md:mx-0">
      <Row
        className="bg-white rounded-md shadow-md py-8 px-4"
        justify="space-around"
      >
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className="border-r border-slate-200"
        >
          <div className=" flex flex-col items-center justify-center">
            <div>
              <ApplaudIcon />
            </div>
            <div>
              <p className="text-primary text-xl font-extrabold my-2">
                {applaudCount}
              </p>
            </div>
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12}>
          <div className=" flex flex-col items-center justify-center">
            <div>
              <StarIcon />
            </div>
            <div>
              <p className="text-primary text-xl font-extrabold my-2">
                {ratingHandler(reviewRating)}
              </p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24}>
          <hr className="my-3" />
        </Col>

        <Col xs={24} sm={24} md={24} lg={24}>
          <div className="py-2 px-3  my-4 rounded ">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <ClockIcon />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary text-xl font-extrabold my-2 ">
                  {tempTime.days()}
                </p>
                <p className="text-gray-500 text-sm xl:text-base mb-0">
                  Day(s)
                </p>
              </div>

              <div className="flex flex-col items-center">
                <p className="text-primary text-xl font-extrabold my-2 ">
                  {tempTime.hours()}
                </p>
                <p className="text-gray-500 text-sm xl:text-base mb-0">
                  Hour(s)
                </p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-primary text-xl font-extrabold my-2 ">
                  {tempTime.minutes()}
                </p>
                <p className="text-gray-500 text-sm xl:text-base mb-0">
                  Min(s).
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SiderRight;
