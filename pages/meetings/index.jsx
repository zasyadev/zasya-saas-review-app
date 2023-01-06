import React from "react";
import MeetingsList from "../../component/Meetings/MeetingsList";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function MeetingPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Meetings"}>
          <MeetingsList user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default MeetingPage;
