import { Skeleton, Timeline } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { ClockCircleOutlined } from "@ant-design/icons";
import NoRecordFound from "../common/NoRecordFound";
import moment from "moment";
import DefaultImages from "../common/DefaultImages";

function GoalsDetailComponent({ setTitle }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [timeLineData, setTimeLineData] = useState([]);
  const [goalData, setGoalData] = useState({});

  const fetchGoalData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/goals/${router.query.goal_id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          if (response.data.GoalsTimeline) {
            setGoalData(response.data);
            setTimeLineData(response.data.GoalsTimeline);
          }
          setTitle(response.data.goal_title ?? "");
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
  return loading ? (
    <div className=" bg-white rounded-md  shadow-md flex-1 p-4  lg:p-5">
      <Skeleton active className="mt-4 mb-2" />
      <Skeleton active />
    </div>
  ) : (
    <div className=" flex-1 p-4  lg:p-5  space-y-4 ">
      <div className="p-4 bg-white rounded-md  shadow-md ">
        <div className="flex-1 space-y-2 ">
          <p className=" text-primary font-bold text-base md:text-lg text-center">
            {goalData?.goal_title}
          </p>
          <p className=" text-primary font-medium text-sm md:text-base ">
            {goalData?.goal_description}
          </p>
          <p className=" text-primary font-semibold text-sm md:text-base capitalize">
            Goal Scope : {goalData?.frequency}
          </p>
        </div>
      </div>
      {goalData && goalData?.GoalAssignee?.length > 0 && (
        <>
          <p className=" text-primary font-bold text-lg md:text-xl mb-0">
            Assignees
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white rounded-md  shadow-md ">
            {goalData?.GoalAssignee?.map((item, idx) => (
              <div
                key={item.id + idx}
                className="overflow-hidden p-4  cursor-pointer flex gap-4 shrink-0 items-center"
              >
                <div className="shrink-0  lg:hidden">
                  <DefaultImages
                    imageSrc={item?.assignee?.UserDetails?.image}
                    width={40}
                    height={40}
                  />
                </div>
                <div className="shrink-0 hidden lg:block">
                  <DefaultImages
                    imageSrc={item?.assignee?.UserDetails?.image}
                    width={50}
                    height={50}
                  />
                </div>

                <div className="flex-1 space-y-2 ">
                  <p className=" text-primary font-semibold text-sm md:text-base">
                    {item?.assignee?.first_name}
                  </p>

                  <div className="flex justify-between items-center shrink-0">
                    <div className="flex" title="Applaud Taken">
                      <div className="flex items-end  text-sm md:text-base font-medium text-gray-600">
                        Status : {item?.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <p className=" text-primary font-bold text-lg md:text-xl mb-0">
        TimeLine
      </p>
      <Timeline className="p-4 py-6 bg-white rounded-md  shadow-md ">
        {timeLineData?.length ? (
          timeLineData.map((item) => (
            <Timeline.Item
              dot={
                <ClockCircleOutlined
                  style={{
                    fontSize: "16px",
                    color: "#0f123f",
                  }}
                />
              }
            >
              <div className="flex items-start gap-2 ">
                <p className="flex-1 font-semibold mb-1 text-sm md:text-base">
                  <span className="capitalize  ">{item.user.first_name}</span>{" "}
                  updated the goal status to {item.status}.
                </p>
                {item.created_date && (
                  <p className=" mb-0  text-gray-400  text-xs leading-6 ">
                    {moment(item.created_date).fromNow()}
                  </p>
                )}
              </div>

              <p className=" mb-0 text-sm md:text-base">{item.comment}</p>
            </Timeline.Item>
          ))
        ) : (
          <NoRecordFound title={"No Timeline Found"} />
        )}
      </Timeline>
    </div>
  );
}

export default GoalsDetailComponent;
