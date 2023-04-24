import React from "react";
import MeetingsList from "../../component/Meetings/MeetingsList";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function FollowUpMeetingPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Follow Ups"}>
          <MeetingsList user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default FollowUpMeetingPage;
