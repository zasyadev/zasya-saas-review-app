import { Dropdown, Tooltip } from "antd";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { getFirstLetter } from "../../helpers/utils";

function CustomAvatar({ userList, avatarCount, className }) {
  const remainingAvatarCount = avatarCount - 1;
  return (
    <div className="flex items-center">
      {userList.length > 0 &&
        userList.map((data, index) =>
          index < avatarCount ? (
            <Tooltip
              title={data?.assignee?.first_name}
              placement="top"
              key={index + "users"}
            >
              <div
                className={twMerge(
                  clsx(
                    "border-2 text-white flex justify-center items-center capitalize hover:cursor-pointer hover:z-50",
                    "transition-all duration-200 ease-in-out rounded-full bg-green-600 -ml-2",
                    `z-${index}0`,
                    {
                      "bg-cyan-500 ml-0 z-0": index === 0,
                      "bg-orange-600": index === 1,
                    },
                    className
                  )
                )}
              >
                {getFirstLetter(data?.assignee?.first_name)}
              </div>
            </Tooltip>
          ) : null
        )}
      {userList.length - avatarCount > 0 && (
        <Dropdown
          trigger={"click"}
          overlay={
            <div className="divide-y w-48 max-h-48 overflow-auto bg-white rounded-md">
              {userList.map((data, index) =>
                index > remainingAvatarCount ? (
                  <div
                    className={`font-semibold px-4 py-2 cursor-pointer hover:bg-gray-50 `}
                    key={data?.assignee?.first_name + index}
                  >
                    <div className={`flex mb-0 items-center space-x-2`}>
                      <div
                        className={twMerge(
                          clsx(
                            "flex justify-center bg-green-600 items-center capitalize hover:cursor-pointer hover:z-50",
                            "transition-all duration-200 ease-in-out rounded-full text-xs border-2 text-white",
                            {
                              "bg-cyan-500 ": index === 0,
                              "bg-orange-600 ": index === 1,
                            },
                            className
                          )
                        )}
                      >
                        {getFirstLetter(data?.assignee?.first_name)}
                      </div>
                      <span>{data?.assignee?.first_name} </span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          }
          placement="right"
        >
          <div
            className={`bg-orange-200 -ml-2  border-2 z-40  flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 transition-all duration-200 ease-in-out rounded-full ${className} `}
          >
            +{userList.length - avatarCount}
          </div>
        </Dropdown>
      )}
    </div>
  );
}

export default CustomAvatar;
