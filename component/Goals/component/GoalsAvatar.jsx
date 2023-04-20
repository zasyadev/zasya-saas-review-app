import { Dropdown, Tooltip } from "antd";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getFirstTwoLetter } from "../../../helpers/truncateString";

const avatarCount = 3;
const remainingAvatarCount = avatarCount - 1;

function GoalsAvatar({
  activeGoalUsers,
  filterByMembersId,
  setFilterByMembersId,
}) {
  return (
    <div className="flex items-center">
      {activeGoalUsers.length > 0 &&
        activeGoalUsers.map((data, index) =>
          index < avatarCount ? (
            <Tooltip
              title={data?.user?.first_name}
              placement="top"
              key={index + "users"}
            >
              <div
                className={twMerge(
                  clsx(
                    "border-2  flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 rounded-full",
                    "text-white transition-all duration-200 ease-in-out  w-10 h-10 bg-green-600 -ml-2 border-white",
                    `z-${index}0`,
                    {
                      "bg-cyan-500 ml-0 z-0": index === 0,
                      "bg-orange-600": index === 1,
                      "border-black shadow-sm shadow-black":
                        filterByMembersId.includes(data?.user?.id),
                    }
                  )
                )}
                onClick={() => {
                  if (filterByMembersId.includes(data?.user?.id)) {
                    setFilterByMembersId((prev) =>
                      prev.filter((item) => item !== data?.user?.id)
                    );
                  } else {
                    setFilterByMembersId((prev) => [...prev, data?.user?.id]);
                  }
                }}
              >
                {getFirstTwoLetter(data?.user?.first_name)}
              </div>
            </Tooltip>
          ) : null
        )}
      {activeGoalUsers.length - avatarCount > 0 && (
        <Dropdown
          trigger={"click"}
          overlay={
            <div className="divide-y w-48 max-h-48 overflow-auto bg-white rounded-md">
              {activeGoalUsers.map(
                (data, index) =>
                  index > remainingAvatarCount && (
                    <div
                      className={clsx(
                        "font-semibold px-4 py-2 cursor-pointer hover:bg-gray-50",
                        {
                          "bg-gray-300": filterByMembersId.includes(
                            data?.user?.id
                          ),
                        }
                      )}
                      key={data?.user?.first_name + index}
                      onClick={() => {
                        if (filterByMembersId.includes(data?.user?.id)) {
                          setFilterByMembersId((prev) =>
                            prev.filter((item) => item !== data?.user?.id)
                          );
                        } else {
                          setFilterByMembersId((prev) => [
                            ...prev,
                            data?.user?.id,
                          ]);
                        }
                      }}
                    >
                      <div className={`flex mb-0 items-center space-x-2`}>
                        <div
                          className={twMerge(
                            clsx(
                              "border-2 bg-green-600 flex justify-center items-center capitalize hover:cursor-pointer hover:z-50",
                              "transition-all duration-200 ease-in-out rounded-full text-xs w-8 h-8 text-white",
                              {
                                "bg-cyan-500": index === 0,
                                "bg-orange-600": index === 1,
                              }
                            )
                          )}
                        >
                          {getFirstTwoLetter(data?.user?.first_name)}
                        </div>
                        <span>{data?.user?.first_name} </span>
                      </div>
                    </div>
                  )
              )}
            </div>
          }
          placement="bottomRight"
        >
          <div className="bg-orange-200 -ml-2  border-2 z-40  flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 transition-all duration-200 ease-in-out rounded-full w-10 h-10">
            +{activeGoalUsers.length - avatarCount}
          </div>
        </Dropdown>
      )}
    </div>
  );
}

export default GoalsAvatar;
