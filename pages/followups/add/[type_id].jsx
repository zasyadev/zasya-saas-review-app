import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

const CreateMeetingTypeComponent = dynamic(
  () => import("../../../component/Meetings/CreateMeetingTypeComponent"),
  {
    suspense: true,
  }
);

function CreateMeetingTypePage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={"Create Follow Up"} isBack>
            <CreateMeetingTypeComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default CreateMeetingTypePage;
