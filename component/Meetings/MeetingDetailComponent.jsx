import { CalendarOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { MONTH_DATE_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import CustomAvatar from "../common/CustomAvatar";
import { PrimaryButton } from "../common/CustomButton";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { DateBox } from "../DashBoard/component/helperComponent";
import { PulseLoader } from "../Loader/LoadingSpinner";
import MeetingCommentModal from "./MeetingCommentModal";
import Link from "next/link";
import { URLS } from "../../constants/urls";
import {
  getStatusBackground,
  getStatusPillColor,
  getRandomBgColor,
  getFirstLetter,
} from "../../helpers/utils";
import { CASUAL_MEETING_TYPE } from "./constants";
import CustomPopConfirm from "../common/CustomPopConfirm";

const initialMeetingModalData = {
  meetingTitle: null,
  meetingId: "",
  isVisible: false,
  assigneeId: "",
};

function MeetingDetailComponent({ user }) {
  const router = useRouter();
  const { meeting_id } = router.query;
  const [loading, setLoading] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [meetingModalData, setMeetingModalData] = useState(
    initialMeetingModalData
  );

  async function fetchMeetingData() {
    setLoading(true);

    await httpService
      .get(`/api/meetings/${meeting_id}`)
      .then(({ data: response }) => {
        setMeetingData(response.data);
        setUserData(
          response.data.MeetingAssignee.find(
            (item) => item.assignee_id === user.id
          )
        );
      })
      .catch((err) =>
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        )
      )
      .finally(() => setLoading(false));
  }

  const meetingTimeLinedata = useMemo(() => {
    if (!meetingData || !meetingData.MeetingAssignee) {
      return [];
    }

    const pastMeetingData =
      meetingData.relatedMeetings?.flatMap((item) => item.MeetingAssignee) ||
      [];

    const meetingComments =
      meetingData.MeetingAssignee.flatMap((item) =>
        item.MeetingAssigneeComment.map((i) => ({
          ...item,
          comment: i.comment,
          modified_date: i.modified_date,
        }))
      ) || [];

    return [
      ...meetingData.MeetingAssignee,
      ...pastMeetingData,
      ...meetingComments,
    ].sort((a, b) => moment(b.modified_date) - moment(a.modified_date));
  }, [meetingData]);

  const hideMeetingModal = () => {
    setMeetingModalData(initialMeetingModalData);
  };

  useEffect(() => {
    if (meeting_id) fetchMeetingData();
  }, [meeting_id]);

  async function handleOnDelete(id) {
    if (id) {
      await httpService
        .delete(`/api/meetings/${id}`, {})
        .then(() => {
          router.push(URLS.FOLLOW_UP);
        })
        .catch((err) => {
          openNotificationBox("error", err.response.data?.message);
        });
    }
  }

  if (loading)
    return (
      <div className="container mx-auto max-w-full">
        <PulseLoader />
      </div>
    );

  if (!meetingData) return <NoRecordFound title={"No Meeting Found"} />;

  return (
    <div className="bg-white rounded-md  shadow-md relative p-4 lg:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 md:space-x-8">
        <div className=" space-y-5  col-span-2">
          <p className="  font-bold text-lg md:text-xl mb-0 break-all">
            {meetingData?.meeting_title}
          </p>

          <p className="  font-medium text-xs md:text-sm mb-0">
            {meetingData?.meeting_description}
          </p>

          <p className="flex text-primary-green  font-medium text-xs md:text-sm mb-0 space-x-2">
            <CalendarOutlined className="text-base leading-0" />
            <span>
              {moment(meetingData?.meeting_at).format(MONTH_DATE_FORMAT)}
            </span>
          </p>
          <div className="space-y-2">
            <p className="font-semibold text-lg md:text-xl mb-0">
              Meeting Members
            </p>
            <div className="flex justify-between items-center space-y-2 pr-2">
              <CustomAvatar
                userList={meetingData?.MeetingAssignee}
                avatarCount={2}
                className="w-10 h-10"
              />

              <PrimaryButton
                withLink={false}
                title={"Add Comment"}
                onClick={() => {
                  setMeetingModalData({
                    meetingTitle: meetingData.meeting_title,
                    meetingId: meetingData.id,
                    isVisible: true,
                    assigneeId: userData?.assignee_id,
                  });
                }}
              />
            </div>
          </div>

          {meetingTimeLinedata.length > 0 && (
            <div className="bg-brandGray-100 p-2 md:p-4 lg-p-6 space-y-3 max-h-96 overflow-auto custom-scrollbar">
              {meetingTimeLinedata.map(
                (assignee, idx) =>
                  assignee.comment !== "" && (
                    <div className="space-x-3 flex " key={idx + "assinee"}>
                      <div
                        className={`
   text-white flex justify-center items-center capitalize rounded-full shrink-0 w-10 h-10`}
                        style={{
                          backgroundColor: getRandomBgColor(idx),
                        }}
                      >
                        {getFirstLetter(assignee.assignee.first_name)}
                      </div>
                      <div className="space-y-2">
                        <p className="font-semibold text-base mb-0 ">
                          {assignee.assignee.first_name}
                          <span className="text-xs text-gray-400 ml-3">
                            {moment(assignee.modified_date).format(
                              MONTH_DATE_FORMAT
                            )}
                          </span>
                        </p>
                        <p className="font-medium text-sm mb-0 ">
                          {assignee.comment}
                        </p>
                      </div>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
        <div className="space-y-4">
          {user.id === meetingData.created_by && (
            <div className="flex justify-end items-center gap-3 flex-wrap">
              <PrimaryButton
                withLink={true}
                linkHref={`${URLS.FOLLOW_UP_EDIT}/${meetingData.id}/?tp=${CASUAL_MEETING_TYPE}`}
                title={"Edit"}
              />

              <CustomPopConfirm
                title={`Are you sure to delete ${meetingData.meeting_title}？`}
                onConfirm={() => handleOnDelete(meetingData.id)}
                label="Delete"
                className="px-4 py-1.5 border-2 border-brandRed-100 bg-brandRed-100 rounded-md text-white cursor-pointer"
              />
            </div>
          )}

          <div className="rounded-md shadow-brand border-2 border-brandGrey-100 divide-y h-fit">
            <p className="p-4 font-semibold text-lg md:text-xl">
              Related Goals
            </p>

            <div className="divide-y max-h-96 overflow-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-2 ">
                  <Skeleton />
                  <Skeleton />
                </div>
              ) : meetingData.goalData.length > 0 ? (
                meetingData.goalData.map((item, idx) => {
                  return (
                    <div
                      className="flex items-center space-x-4  px-4 py-3"
                      key={idx + item.id}
                    >
                      <div className="shrink-0">
                        <DateBox
                          date={item.goal.end_date}
                          className={getStatusBackground(item.status)}
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href={`${URLS.GOAL}/${item.goal.id}/detail`}
                          passHref
                        >
                          <p className="mb-2 font-medium text-base break-all single-line-clamp cursor-pointer hover:underline">
                            {item.goal.goal_title}
                          </p>
                        </Link>

                        <p className="flex justify-between items-center">
                          <span
                            className={`text-xs font-medium px-2 py-1 uppercase rounded-md ${getStatusPillColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <NoRecordFound title="No Goals Found" />
              )}
            </div>
          </div>
        </div>
      </div>

      {meetingModalData?.isVisible && (
        <MeetingCommentModal
          meetingModalData={meetingModalData}
          hideMeetingModal={hideMeetingModal}
          fetchMeetingData={fetchMeetingData}
        />
      )}
    </div>
  );
}

export default MeetingDetailComponent;
