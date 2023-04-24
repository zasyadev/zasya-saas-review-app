import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

const AddEditMeetingComponent = dynamic(
  () => import("../../../component/Meetings/AddEditMeetingComponent"),
  {
    suspense: true,
  }
);

function EditMeetingPage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={"Edit Follow Up"} isBack>
            <AddEditMeetingComponent user={user} editMode={true} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default EditMeetingPage;
