import { Timeline } from "antd";
import moment from "moment";
import React from "react";
import randomBgColor from "../../../helpers/randomBgColor";
import { getFirstLetter } from "../../../helpers/truncateString";

function ApplaudTimeline({ list }) {
  return (
    <Timeline className=" pl-8  space-y-2  p-4 ">
      {list.map((item, index) => (
        <Timeline.Item
          dot={
            <div
              className={
                " text-white capitalize rounded-full w-9 h-9 grid place-content-center"
              }
              style={{ backgroundColor: randomBgColor(index * 3) }}
            >
              {getFirstLetter(item.created.first_name)}
            </div>
          }
          className="recent-activity-timeline"
          key={item.id + index + "activity"}
        >
          <div className="px-3">
            <p className="flex-1 font-semibold mb-0 text-base ">
              <span className="capitalize  ">{item.created.first_name}</span>{" "}
              has Applauded {item.user.first_name}.
            </p>
            <p className="flex-1  mb-0 text-sm ">{item.comment}</p>
            {item.created_date && (
              <p className="mt-1 mb-0  font-semibold text-xs leading-6 ">
                {moment(item.created_date).fromNow()}
              </p>
            )}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
}

export default ApplaudTimeline;
