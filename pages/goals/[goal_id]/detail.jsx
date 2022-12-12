import React, { useState } from "react";
import SuspenceWrapper from "../../../component/common/SuspenceWrapper";
import GoalsDetailComponent from "../../../component/Goals/GoalsDetailComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";

function GoalsDetailPage() {
  const [title, setTitle] = useState("");

  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title={`${title} Timeline`}>
            <GoalsDetailComponent setTitle={setTitle} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default GoalsDetailPage;
