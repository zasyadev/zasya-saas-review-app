import { CalendarOutlined } from "@ant-design/icons";
import { Timeline } from "antd";
import clsx from "clsx";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { URLS } from "../../constants/urls";
import {
  MONTH_DATE_FORMAT,
  dateDayName,
  dateTime,
} from "../../helpers/dateHelper";
import {
  getFirstLetter,
  getRandomBgColor,
  getStatusPillColor,
} from "../../helpers/utils";
import httpService from "../../lib/httpService";
import { PulseLoader } from "../Loader/LoadingSpinner";
import { GOAL_MEETING_TYPE } from "../Meetings/constants";
import { PrimaryButton } from "../common/CustomButton";
import CustomPopConfirm from "../common/CustomPopConfirm";
import CustomTable from "../common/CustomTable";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import GoalStatusModal from "./GoalStatusModal";
import { INDIVIDUAL_TYPE, TEAM_TYPE } from "./constants";

const initialModalVisible = {
  visible: false,
  id: "",
  goal_title: "",
  defaultValue: "",
  goal_id: "",
};

function GoalsDetailComponent({ user }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [goalData, setGoalData] = useState(null);
  const [editGoalModalVisible, setEditGoalModalVisible] =
    useState(initialModalVisible);

  const fetchGoalData = async () => {
    setLoading(true);
    setGoalData(null);
    await httpService
      .get(`/api/goals/${router.query.goal_id}`)
      .then(({ data: response }) => {
        setGoalData(response.data);
      })
      .catch(() => setGoalData(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (router?.query && router?.query?.goal_id) fetchGoalData();
  }, [router?.query?.goal_id]);

  const goalStatus = useMemo(() => {
    if (goalData && goalData?.GoalAssignee?.length > 0) {
      return goalData?.GoalAssignee.find(
        (item) => item.assignee_id === goalData?.created_by
      );
    } else return "";
  }, [goalData]);

  const columns = [
    {
      title: "Title",
      key: "meeting_title",
      render: (_, record) => (
        <Link href={`/followups/${record.meeting.id}`} passHref>
          <p className="cursor-pointer text-gray-500 mb-0 hover:underline">
            {record.meeting.meeting_title}
          </p>
        </Link>
      ),
    },
    {
      title: "Date",
      key: "meeting_at",
      render: (_, record) =>
        moment(record.meeting.meeting_at).format(MONTH_DATE_FORMAT),
    },
    {
      title: "Day / Time ",
      key: "meeting_at_time",
      render: (_, record) => (
        <>
          {dateDayName(record.meeting.meeting_at)},{" "}
          {dateTime(record.meeting.meeting_at)}
        </>
      ),
    },
  ];

  const goalEditHandle = async ({ goal_id, id, value, type }) => {
    setLoading(true);
    await httpService
      .put(`/api/goals/${goal_id}`, {
        value,
        type,
        id,
      })
      .then(({ data: response }) => {
        if (type === "forDelete") router.push(URLS.GOAL);
        else fetchGoalData();
        setEditGoalModalVisible(initialModalVisible);
        openNotificationBox("success", response.message, 3);
      })
      .catch((err) => openNotificationBox("error", err.response.data?.message))
      .finally(() => setLoading(false));
  };

  const showEditGoalModal = ({ record }) => {
    if (goalStatus?.assignee_id)
      setEditGoalModalVisible({
        visible: true,
        id: goalStatus.id,
        goal_title: record.goal_title,
        defaultValue: goalStatus.status,
        goal_id: record.id,
      });
  };

  const hideEditGoalModal = () => {
    setEditGoalModalVisible(initialModalVisible);
  };

  if (loading)
    return (
      <div className="container mx-auto max-w-full">
        <PulseLoader />
      </div>
    );

  if (!goalData) return <NoRecordFound title={"No Goal Found"} />;

  return (
    <>
      <div className="bg-white rounded-md  shadow-md relative p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-8">
          <div className="space-y-5 col-span-2">
            <p className="font-bold text-lg md:text-xl mb-0 break-all">
              {goalData.goal_title}
            </p>

            <p className="font-medium text-xs md:text-sm mb-0">
              {goalData.goal_description}
            </p>

            <p className="flex text-primary-green  font-medium text-xs md:text-sm mb-0 space-x-2">
              <CalendarOutlined className="text-base leading-0" />
              <span>
                {moment(goalData.created_date).format(MONTH_DATE_FORMAT)}
              </span>
            </p>

            <div className="bg-brandGray-100 p-2 md:p-4 lg-p-6 space-y-3 max-h-96 overflow-auto custom-scrollbar rounded-md">
              <p className="font-semibold text-base md:text-lg mb-0 break-all">
                Timeline
              </p>

              {goalData.GoalsTimeline.length > 0 ? (
                <Timeline className="px-4 pt-6 space-y-2 overflow-auto no-scrollbar">
                  {goalData.GoalsTimeline.map((item, index) => (
                    <Timeline.Item
                      dot={
                        <div
                          className={
                            "border text-white capitalize  rounded-full w-10 h-10 grid place-content-center"
                          }
                          style={{
                            backgroundColor: getRandomBgColor(index * 3),
                          }}
                        >
                          {getFirstLetter(item.user.first_name)}
                        </div>
                      }
                      className="recent-activity-timeline"
                      key={item.id + "timeline"}
                    >
                      <div className="px-3">
                        <p className="flex-1 font-semibold mb-0 text-base ">
                          {item.user.first_name}
                        </p>
                        <p className="mb-0 text-sm">{item.comment}</p>
                        {item.created_date && (
                          <p className="mt-1 mb-0  font-semibold text-xs leading-6 ">
                            {moment(item.created_date).fromNow()}
                          </p>
                        )}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <NoRecordFound title={"No Timeline Found"} />
              )}
            </div>
          </div>
          <div className="space-y-4">
            {goalData.created_by === user.id && (
              <div className="flex justify-end items-center gap-3 flex-wrap">
                <PrimaryButton
                  withLink={true}
                  linkHref={`${URLS.GOAL}/${goalData.id}/edit`}
                  title={"Edit"}
                />
                <CustomPopConfirm
                  title={`Are you sure to ${
                    goalData.is_archived ? "unarchived" : "archived"
                  } ${goalData.goal_title} ？`}
                  onConfirm={() =>
                    goalEditHandle({
                      goal_id: goalData.id,
                      id: goalData.id,
                      value: goalData.is_archived ? false : true,
                      type: "forArchived",
                    })
                  }
                  className="px-4 py-1.5 border-2 border-primary-green rounded-md text-primary-green cursor-pointer"
                  label={goalData.is_archived ? "UnArchive" : "Archive"}
                />

                {goalData.is_archived && (
                  <CustomPopConfirm
                    title={`Are you sure to delete ${goalData.goal_title} ？`}
                    onConfirm={() =>
                      goalEditHandle({
                        goal_id: goalData.id,
                        id: goalData.id,
                        value: goalData.is_archived ? false : true,
                        type: "forDelete",
                      })
                    }
                    className="px-4 py-1.5 border-2 border-brandRed-100 bg-brandRed-100 rounded-md text-white cursor-pointer"
                    label="Delete"
                  />
                )}
              </div>
            )}

            <div className="rounded-md shadow-brand border-2 border-brandGrey-100 divide-y h-fit">
              <p className="p-4 font-semibold text-lg md:text-xl mb-0">
                Details
              </p>

              <div className="divide-y">
                <div className="p-4 space-y-1">
                  <p className="mb-0">Created By</p>
                  <p className="font-medium text-base mb-0">
                    {goalData.created.first_name}
                  </p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="mb-0">Goal Scope</p>
                  <p className="font-medium text-base capitalize mb-0">
                    {goalData.frequency}
                  </p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="mb-0">Status</p>
                  <p className="font-medium text-base mb-0">
                    <span
                      className={clsx(
                        "px-2 py-1 font-medium text-xs md:text-sm mb-0 uppercase rounded-md cursor-pointer",
                        getStatusPillColor(goalStatus?.status)
                      )}
                      onClick={() => {
                        if (
                          !goalData.is_archived &&
                          goalData.created_by === user.id
                        ) {
                          showEditGoalModal({
                            record: goalData,
                          });
                        }
                      }}
                    >
                      {goalStatus?.status}
                    </span>
                  </p>
                </div>
                <div className="p-4 space-y-1">
                  <p className="mb-0 z-20">End Date</p>
                  <p className="font-medium text-base mb-0">
                    {moment(goalData.end_date).format(MONTH_DATE_FORMAT)}
                  </p>
                </div>

                {goalData.GoalAssignee.length > 1 && (
                  <div className="p-4 space-y-1">
                    <p className="mb-0">Assignees</p>
                    <div className="grid md:grid-cols-2 gap-2 max-h-40 overflow-auto custom-scrollbar space-y-2">
                      {goalData.GoalAssignee.filter(
                        (item) => item.assignee_id !== goalData.created_by
                      ).map((item) => (
                        <>
                          <p
                            className="text-gray-700 font-semibold text-base mb-0"
                            key={item.id + "name"}
                          >
                            {item.assignee.first_name}
                          </p>
                          <span
                            className={clsx(
                              "lg:w-28 px-2 py-1 font-medium text-xs md:text-sm mb-0 text-center uppercase rounded-md h-fit",
                              getStatusPillColor(item.status)
                            )}
                            key={item.id + "status"}
                          >
                            {item.status}
                          </span>
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {(goalData.goal_type === INDIVIDUAL_TYPE ||
          goalData.goal_type === TEAM_TYPE) &&
          goalData.created_by === user.id && (
            <div className="mb-2 flex justify-end mt-4">
              <PrimaryButton
                withLink={true}
                linkHref={`/followups/add/${router.query.goal_id}?tp=${GOAL_MEETING_TYPE}`}
                title={"Add Follow up"}
              />
            </div>
          )}
      </div>
      {goalData.MeetingType.length > 0 && (
        <div className="bg-white rounded-md  shadow-md relative p-4 lg:p-6 mt-4 md:mt-6">
          <p className="font-semibold text-base md:text-lg  mb-2">
            Follow Up Meeting
          </p>
          <CustomTable
            dataSource={goalData.MeetingType}
            columns={columns}
            className="custom-table"
            isPagination={goalData.MeetingType.length > 10}
            showHeader={false}
          />
        </div>
      )}
      {editGoalModalVisible?.visible && (
        <GoalStatusModal
          editGoalModalVisible={editGoalModalVisible}
          hideEditGoalModal={hideEditGoalModal}
          goalEditHandle={goalEditHandle}
          loading={loading}
        />
      )}
    </>
  );
}

export default GoalsDetailComponent;
