import { Skeleton, Timeline } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import { ClockCircleOutlined } from "@ant-design/icons";
import NoRecordFound from "../common/NoRecordFound";
import moment from "moment";

function GoalsDetailComponent({ setTitle }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [timeLineData, setTimeLineData] = useState([]);

  const fetchGoalData = async () => {
    setLoading(true);
    await httpService
      .get(`/api/goals/${router.query.goal_id}`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          if (response.data.GoalsTimeline) {
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
    <>
      <Skeleton active className="mt-4 mb-2" />
      <Skeleton active />
    </>
  ) : (
    <div className=" bg-white rounded-md  shadow-md flex-1 p-4  lg:p-5 received--all-applaud">
      <Timeline className="pl-1 py-2">
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
              <div className="flex items-start gap-2">
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
