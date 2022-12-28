import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

const AddEditGoalComponent = dynamic(
  () => import("../../component/Goals/AddEditGoalComponent"),
  {
    suspense: true,
  }
);

function GoalAddPage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={"Create Goals"}>
            <AddEditGoalComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default GoalAddPage;
