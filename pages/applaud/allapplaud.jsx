import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import AllAplaud from "../../component/Applaud/AllAplaud";
import WithMe from "../../component/layout/WithMe";

function Allapplaud() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="All Applauds">
          <AllAplaud user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default Allapplaud;
