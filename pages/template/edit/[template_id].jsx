import React from "react";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import EditTemplateComponent from "../../../component/Template/EditTemplateComponent";

function EditTemplate() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title="Template">
          <EditTemplateComponent user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default EditTemplate;
