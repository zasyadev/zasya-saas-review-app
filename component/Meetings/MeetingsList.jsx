import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import httpService from "../../lib/httpService";
import MeetingListSkeleton from "./component/MeetingListSkeleton";

function GoalsList({ user, isArchived = false }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [meetingsList, setMeetingsList] = useState([]);

  async function fetchMeetingList() {
    setLoading(true);
    setMeetingsList([]);

    await httpService
      .get(`/api/meetings`)
      .then(({ data: response }) => {
        if (response.status === 200) {
          setMeetingsList(response.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err?.response?.data?.message);
      });
  }

  useEffect(() => {
    fetchMeetingList();
  }, []);

  return (
    <div className="container mx-auto max-w-full">
      <div className={`grid grid-cols-1gap-4`}>
        {loading ? <MeetingListSkeleton /> : null}
      </div>

      {/* {goalAssigneeModalData?.isVisible && (
        <GoalAssignessModal
          goalAssigneeModalData={goalAssigneeModalData}
          hideAssigneeModal={hideAssigneeModal}
          userId={user.id}
        />
      )} */}
    </div>
  );
}

export default GoalsList;
