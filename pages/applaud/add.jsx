import React from "react";
import AddApplaudComponent from "../../component/Applaud/AddApplaudComponent";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

function Addapplaud() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Create Applaud">
          <AddApplaudComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default Addapplaud;
