import { Dropdown, Tooltip } from "antd";
import React from "react";
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
      {Number(activeGoalUsers.length) > 0 &&
        activeGoalUsers.map((data, index) =>
          index < avatarCount ? (
            <Tooltip
              title={data?.user?.first_name}
              placement="top"
              key={index + "users"}
            >
              <div
                className={`${
                  index === 0
                    ? "bg-cyan-500 "
                    : index === 1
                    ? "bg-orange-600 -ml-2"
                    : "bg-green-600 -ml-2"
                } 
            z-${index === 0 ? "0" : `${index}0`}
            ${
              filterByMembersId.includes(data?.user?.id)
                ? "border-primary"
                : "border-white"
            } border-2 text-white flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 transition-all duration-200 ease-in-out rounded-full w-10 h-10`}
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
      {Number(activeGoalUsers.length - avatarCount) > 0 && (
        <Dropdown
          trigger={"click"}
          overlay={
            <div className="divide-y w-48 max-h-48 overflow-auto bg-white rounded-md">
              {activeGoalUsers.map((data, index) =>
                index > remainingAvatarCount ? (
                  <div
                    className={`font-semibold px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                      filterByMembersId.includes(data?.user?.id)
                        ? " bg-gray-100"
                        : ""
                    }`}
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
                        className={`${
                          index === 0
                            ? "bg-cyan-500 "
                            : index === 1
                            ? "bg-orange-600"
                            : "bg-green-600"
                        } 
             border-2 text-white flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 transition-all duration-200 ease-in-out rounded-full text-xs w-8 h-8`}
                      >
                        {getFirstTwoLetter(data?.user?.first_name)}
                      </div>
                      <span>{data?.user?.first_name} </span>
                    </div>
                  </div>
                ) : null
              )}
            </div>
          }
          placement="bottomRight"
        >
          <div className="bg-orange-200 -ml-2  border-2 z-40 text-primary flex justify-center items-center capitalize hover:cursor-pointer hover:z-50 transition-all duration-200 ease-in-out rounded-full w-10 h-10">
            +{activeGoalUsers.length - avatarCount}
          </div>
        </Dropdown>
      )}
    </div>
  );
}

export default GoalsAvatar;
