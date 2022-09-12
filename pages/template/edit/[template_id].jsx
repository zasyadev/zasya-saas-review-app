import React from "react";
import { HeadersComponent } from "../../../component/common/HeadersComponent";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import EditTemplateComponent from "../../../component/Template/EditTemplateComponent";

function EditTemplate() {
  return (
    <WithMe>
      {({ user }) => (
        // <AdminLayout user={user} title="Template">

        <>
          <HeadersComponent />
          <EditTemplateComponent user={user} />
        </>
        // </AdminLayout>
      )}
    </WithMe>
  );
}

export default EditTemplate;
