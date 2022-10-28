import React from "react";
import AdminLayout from "../../component/layout/AdminLayout";
import WithMe from "../../component/layout/WithMe";
import TemplateLayout from "../../component/Template/TemplateLayout";

function TemplatePage() {
  return (
    <WithMe>
      {({ user }) => (
        <AdminLayout user={user} title={"Templates"}>
          <TemplateLayout user={user} />
        </AdminLayout>
      )}
    </WithMe>
  );
}

export default TemplatePage;
