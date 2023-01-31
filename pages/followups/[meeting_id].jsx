import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import MeetingDetailComponent from "../../component/Meetings/MeetingDetailComponent";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function FollowUpMeetingDetailPage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} isBack>
            <MeetingDetailComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default FollowUpMeetingDetailPage;
