import dynamic from "next/dynamic";
import React from "react";
import SuspenceWrapper from "../../component/common/SuspenceWrapper";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";

const AddApplaudComponent = dynamic(
  () => import("../../component/Applaud/AddApplaudComponent"),
  {
    suspense: true,
  }
);

function Addapplaud() {
  return (
    <SuspenceWrapper>
      <WithMe>
        {({ user }) => (
          <AdminLayout user={user} title="Create Applaud">
            <AddApplaudComponent user={user} />
          </AdminLayout>
        )}
      </WithMe>
    </SuspenceWrapper>
  );
}

export default Addapplaud;
