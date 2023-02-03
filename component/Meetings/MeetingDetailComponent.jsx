import { CommentOutlined } from "@ant-design/icons";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { DEFAULT_DATE_FORMAT } from "../../helpers/dateHelper";
import httpService from "../../lib/httpService";
import NoRecordFound from "../common/NoRecordFound";
import { openNotificationBox } from "../common/notification";
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
          <p className=" text-primary font-bold text-lg md:text-xl mb-0 break-all">
            {meetingData?.meeting_title}
          </p>
          <div className="space-y-1">
            <p className=" text-primary font-semibold text-base md:text-lg mb-0">
              Description
            </p>
            <p className=" text-primary font-medium text-xs md:text-sm mb-0">
              {meetingData?.meeting_description}
            </p>
          </div>
          <div className="space-y-1">
            <p className=" text-primary font-semibold text-base md:text-lg mb-0">
              Meeting Date
            </p>
            <p className=" text-primary font-medium text-xs md:text-sm mb-0">
              {moment(meetingData?.meeting_at).format(DEFAULT_DATE_FORMAT)}
            </p>
          </div>
        </div>
        <div className="">
          <p className=" text-primary font-bold text-lg md:text-xl mb-2">
            Meeting Members
          </p>
          <div className="space-y-2 pr-2">
            {Number(meetingData?.MeetingAssignee.length) > 0 &&
              meetingData?.MeetingAssignee.map((item, idx) => (
                <div className="space-y-1" key={idx + "meeting"}>
                  <p className=" text-primary font-semibold text-base mb-0 flex justify-between items-center">
                    {item?.assignee?.first_name}
                    {item?.assignee_id === user.id && !item.comment && (
                      <span
                        onClick={() => {
                          setMeetingModalData({
                            meetingTitle: meetingData.meeting_title,
                            meetingId: meetingData.id,
                            isVisible: true,
                            assigneeId: item?.assignee_id,
                          });
                        }}
                        className="cursor-pointer"
                        title="Add comment"
                      >
                        <CommentOutlined className="text-lg" />
                      </span>
                    )}
                  </p>
                  <p className=" text-gray-700 font-medium text-xs md:text-sm mb-0">
                    {item?.comment}
                  </p>
                </div>
              ))}
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
