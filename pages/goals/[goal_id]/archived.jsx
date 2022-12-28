import React, { useState } from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import GoalsDetailComponent from "../../../component/Goals/GoalsDetailComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

function GoalsArchivedPage() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={``}>
            <GoalsDetailComponent isArchived />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default GoalsArchivedPage;
