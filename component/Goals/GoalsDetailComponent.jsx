import { ClockCircleOutlined } from "@ant-design/icons";
import { Skeleton, Timeline } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import { PrimaryButton } from "../common/CustomButton";
import CustomTable from "../common/CustomTable";
import NoRecordFound from "../common/NoRecordFound";
import { GOAL_MEETINGTYPE } from "../Meetings/constants";
import { statusPill } from "./constants";

function GoalsDetailComponent({ isArchived = false }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState({});

  const fetchGoalData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/goals/${router.query.goal_id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          if (response.data) {
            setGoalData(response.data);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (router?.query && router?.query?.goal_id) fetchGoalData();
  }, []);

  const goalStatus = useMemo(() => {
    if (goalData && Number(goalData?.GoalAssignee?.length) > 0) {
      return goalData?.GoalAssignee.find(
        (item) => item.assignee_id === goalData?.created_by
      )?.status;
    } else return "";
  }, [goalData]);

  const columns = [
    {
      title: "Title",
      key: "meeting_title",
      render: (_, record) => record.meeting_title,
    },

    {
      title: "Meeting Date",
      key: "meeting_at",
      render: (_, record) =>
        moment(record.meeting_at).format(DEFAULT_DATE_FORMAT),
    },
  ];
  console.log({ goalData });

  return loading ? (
    <div className=" bg-white rounded-md  shadow-md flex-1 p-4  lg:p-5">
      <Skeleton active className="my-4" />
      <Skeleton active />
    </div>
  ) : (
    <>
      <div className="bg-white rounded-md  shadow-md relative p-4 lg:p-6">
        {isArchived && (
          <div className="border border-gray-200 bg-gray-100 absolute top-0 right-4 px-3 py-1 border-t-0 rounded-b-md">
            Archived
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-8">
          <div className=" space-y-5  col-span-2">
            <p className=" text-primary font-bold text-lg md:text-xl mb-0">
              {goalData?.goal_title}
            </p>
            <div className="space-y-1">
              <p className=" text-primary font-semibold text-base md:text-lg mb-0">
                Description
              </p>
              <p className=" text-primary font-medium text-xs md:text-sm mb-0">
                {goalData?.goal_description}
              </p>
            </div>
            <div className="space-y-1">
              <p className=" text-primary font-semibold text-base md:text-lg mb-0 mt-6">
                Timeline
              </p>
              <Timeline className="p-4 py-6 lg:w-11/12">
                {goalData?.GoalsTimeline?.length > 0 ? (
                  goalData?.GoalsTimeline.map((item) => (
                    <Timeline.Item
                      dot={
                        <ClockCircleOutlined
                          style={{
                            fontSize: "18px",
                            color: "#0f123f",
                          }}
                        />
                      }
                      key={item.id}
                    >
                      <div className="flex items-start gap-2 ">
                        <p className="flex-1 font-semibold mb-1 text-sm md:text-base ">
                          <span className="capitalize  ">
                            {item.user.first_name}
                          </span>{" "}
                          updated the goal status to {item.status}.
                        </p>
                      </div>
                      {item?.comment && (
                        <div className="border border-gray-300 rounded-md px-4 py-3 mt-2">
                          <p className=" mb-0 text-sm md:text-base">
                            {item.comment}
                          </p>
                        </div>
                      )}

                      {item.created_date && (
                        <p className="mt-2 mb-0  text-gray-400  text-xs leading-6 ">
                          {moment(item.created_date).fromNow()}
                        </p>
                      )}
                    </Timeline.Item>
                  ))
                ) : (
                  <NoRecordFound title={"No Timeline Found"} />
                )}
              </Timeline>
            </div>
          </div>
          <div className="">
            <p className=" text-primary font-bold text-lg md:text-xl mb-2">
              Details
            </p>
            <div className="border border-gray-100 p-4 space-y-4 rounded-md">
              <div className="space-y-1">
                <p className=" text-primary font-semibold text-base mb-0">
                  Created By
                </p>
                <p className=" text-gray-700 font-medium text-xs md:text-sm mb-0">
                  {goalData?.created?.first_name}
                </p>
              </div>
              <div className="space-y-1">
                <p className=" text-primary font-semibold text-base mb-0">
                  Goal Scope
                </p>
                <p className=" text-gray-700 font-medium text-xs md:text-sm capitalize mb-0">
                  {goalData?.frequency}
                </p>
              </div>
              <div className="space-y-1">
                <p className=" text-primary font-semibold text-base mb-1">
                  Status
                </p>
                <span
                  className={` px-2 py-1 font-medium text-xs md:text-sm mb-0 uppercase rounded-md ${statusPill(
                    goalStatus
                  )}`}
                >
                  {goalStatus}
                </span>
              </div>
              <div className="space-y-1">
                <p className=" text-primary font-semibold text-base mb-0">
                  End Date
                </p>
                <p className=" text-gray-700 font-medium text-xs md:text-sm mb-0">
                  {moment(goalData?.end_date).format(DEFAULT_DATE_FORMAT)}
                </p>
              </div>

              {goalData && Number(goalData?.GoalAssignee?.length) > 1 && (
                <div className="space-y-1">
                  <p className=" text-primary font-semibold text-base mb-0">
                    Assignees
                  </p>
                  <div className="grid md:grid-cols-2 gap-2 max-h-40 overflow-auto custom-scrollbar">
                    {goalData?.GoalAssignee?.filter(
                      (item) => item.assignee_id !== goalData?.created_by
                    )?.map((item) => (
                      <>
                        <p
                          className=" text-gray-700 font-medium text-xs md:text-sm mb-0"
                          key={item.id + "name"}
                        >
                          {item?.assignee?.first_name}
                        </p>
                        <span
                          className={`w-28 px-2 py-1  font-medium text-xs md:text-sm mb-0 text-center uppercase rounded-md ${statusPill(
                            item?.status
                          )}`}
                          key={item.id + "status"}
                        >
                          {item?.status}
                        </span>
                      </>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mb-2 flex justify-end">
          <PrimaryButton
            withLink={true}
            linkHref={`/meetings/add/${router?.query?.goal_id}?tp=${GOAL_MEETINGTYPE}`}
            title={"Add Meeting"}
          />
        </div>
      </div>
      <div className="bg-white rounded-md  shadow-md relative p-4 lg:p-6 mt-4 md:mt-6">
        {Number(goalData?.Meetings?.length) > 0 && (
          <CustomTable
            dataSource={goalData.Meetings}
            columns={columns}
            className="custom-table"
            isPagination={goalData?.Meetings?.length > 10}
          />
        )}
      </div>
    </>
  );
}

export default GoalsDetailComponent;
