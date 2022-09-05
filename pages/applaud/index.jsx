import React from "react";
import Applaud from "../../component/Applaud/Applaud";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function ApplaudPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Applaud"}>
          <Applaud user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default ApplaudPage;
