import React from "react";
import AdminLayout from "../../../component/layout/AdminLayout";
import WithMe from "../../../component/layout/WithMe";
import TemplateListView from "../../../component/Template/TemplateListView";

function TemplateView() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Template View "}>
          <TemplateListView user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default TemplateView;
