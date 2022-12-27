import React, { useState } from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import GoalsDetailComponent from "../../../component/Goals/GoalsDetailComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

function GoalsArchivedPage() {
  const [title, setTitle] = useState("");
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={``}>
            <GoalsDetailComponent setTitle={setTitle} isArchived />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default GoalsArchivedPage;
