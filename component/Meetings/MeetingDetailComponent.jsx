import { CalendarOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { MONTH_DATE_FORMAT } from "../../helpers/dateHelper";
import randomBgColor from "../../helpers/randomBgColor";
import { getFirstLetter } from "../../helpers/truncateString";
import httpService from "../../lib/httpService";
import CustomAvatar from "../common/CustomAvatar";
import { PrimaryButton } from "../common/CustomButton";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
import { DateBox } from "../DashBoard/component/helperComponent";
import { statusBackground, statusPill } from "../Goals/constants";
import { PulseLoader } from "../Loader/LoadingSpinner";
import MeetingCommentModal from "./MeetingCommentModal";

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
        if (response.status === 200) {
          setMeetingData(response.data);
          setUserData(
            response.data.MeetingAssignee.find(
              (item) => item.assignee_id === user.id
            )
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        openNotificationBox(
          "error",
          err?.response?.data?.message || "Failed! Please try again"
        );
        setLoading(false);
      });
  }

  const meetingTimeLinedata = useMemo(() => {
    if (meetingData && meetingData.MeetingAssignee) {
      let pastMeetingData = [];
      if (
        meetingData?.relatedMeetings &&
        Number(meetingData.relatedMeetings.length) > 0
      ) {
        meetingData.relatedMeetings.map((item) => {
          item.MeetingAssignee.map((i) => {
            pastMeetingData.push(i);
          });
        });
      } else pastMeetingData = [];

      return [...meetingData.MeetingAssignee, ...pastMeetingData];
    } else return [];
  }, [meetingData]);

  const hideMeetingModal = () => {
    setMeetingModalData(initialMeetingModalData);
  };

  useEffect(() => {
    if (meeting_id) fetchMeetingData();
  }, [meeting_id]);

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
          <div className="">
            <p className="  font-bold text-lg md:text-xl mb-2">
              Meeting Members
            </p>
            <div className="flex justify-between items-center space-y-2 pr-2">
              <CustomAvatar
                userList={meetingData?.MeetingAssignee}
                avatarCount={2}
                className="w-10 h-10"
              />

              {userData?.assignee_id === user.id && !userData?.comment && (
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
              )}
            </div>
          </div>
          <div className="bg-brandGray-100 p-2 md:p-4 lg-p-6 space-y-3 max-h-96 overflow-auto custom-scrollbar">
            {Number(meetingTimeLinedata?.length) > 0 &&
              meetingTimeLinedata.map((assignee, idx) =>
                assignee.comment !== "" ? (
                  <div className="space-x-3 flex " key={idx + "assinee"}>
                    <div
                      className={`
   text-white flex justify-center items-center capitalize rounded-full shrink-0 w-10 h-10`}
                      style={{
                        backgroundColor: randomBgColor(idx),
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
                ) : null
              )}
          </div>
        </div>
        <div className="rounded-md shadow-brand border-2 border-brandGrey-100 divide-y h-fit">
          <p className="p-4  font-bold text-lg md:text-xl">Related Goals</p>

          <div className="divide-y max-h-96 overflow-auto custom-scrollbar">
            {loading ? (
              <div className="space-y-2 ">
                <Skeleton />
                <Skeleton />
              </div>
            ) : Number(meetingData.goalData.length) > 0 ? (
              meetingData.goalData.map((item, idx) => {
                return (
                  <div
                    className="flex items-center space-x-4  px-4 py-3"
                    key={idx + item.id}
                  >
                    <div className="shrink-0">
                      <DateBox
                        date={item.goal.end_date}
                        className={statusBackground(item.status)}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="mb-2 font-medium text-base break-all single-line-clamp">
                        {item.goal.goal_title}
                      </p>
                      <p className="flex justify-between items-center">
                        <span
                          className={`text-xs font-medium px-2 py-1 uppercase rounded-md ${statusPill(
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
