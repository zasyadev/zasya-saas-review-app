import React from "react";
import DashBoard from "../../component/DashBoard/DashBoard";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function DashboardPage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Dashboard"} isHeader={false}>
          <DashBoard user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default DashboardPage;
