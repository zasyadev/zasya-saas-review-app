import React from "react";
import DashBoard from "../../component/DashBoard/DashBoard";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function dashboard() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"DashBoard"}>
          <DashBoard user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default dashboard;
